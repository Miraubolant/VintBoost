import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the request has the service role key (for CRON jobs)
    const authHeader = req.headers.get('Authorization')
    const expectedKey = `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`

    // Allow both service role key and manual trigger with API key
    const apiKey = req.headers.get('x-api-key')
    const isAuthorized = authHeader === expectedKey || apiKey === Deno.env.get('CLEANUP_API_KEY')

    if (!isAuthorized) {
      throw new Error('Unauthorized')
    }

    // Create Supabase client with service role for admin access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all expired videos
    const { data: expiredVideos, error: fetchError } = await supabaseAdmin
      .from('user_videos')
      .select('id, user_id, video_url, thumbnail_url')
      .lt('expires_at', new Date().toISOString())
      .not('expires_at', 'is', null)

    if (fetchError) {
      throw new Error(`Failed to fetch expired videos: ${fetchError.message}`)
    }

    if (!expiredVideos || expiredVideos.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No expired videos to clean up', deleted: 0 }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    console.log(`Found ${expiredVideos.length} expired videos to delete`)

    let deletedCount = 0
    const errors: string[] = []

    // Delete each video from storage and database
    for (const video of expiredVideos) {
      try {
        // Extract storage paths from URLs
        const storagePaths: string[] = []

        if (video.video_url) {
          // URL format: .../storage/v1/object/public/videos/{user_id}/{filename}
          const videoMatch = video.video_url.match(/\/videos\/(.+)$/)
          if (videoMatch) {
            storagePaths.push(videoMatch[1])
          }
        }

        if (video.thumbnail_url) {
          const thumbMatch = video.thumbnail_url.match(/\/videos\/(.+)$/)
          if (thumbMatch) {
            storagePaths.push(thumbMatch[1])
          }
        }

        // Delete files from storage
        if (storagePaths.length > 0) {
          const { error: storageError } = await supabaseAdmin.storage
            .from('videos')
            .remove(storagePaths)

          if (storageError) {
            console.error(`Storage delete error for video ${video.id}:`, storageError)
            // Continue anyway to delete database record
          }
        }

        // Delete database record
        const { error: deleteError } = await supabaseAdmin
          .from('user_videos')
          .delete()
          .eq('id', video.id)

        if (deleteError) {
          throw new Error(`Database delete failed: ${deleteError.message}`)
        }

        deletedCount++
        console.log(`Deleted video ${video.id}`)
      } catch (videoError) {
        const errorMsg = `Failed to delete video ${video.id}: ${videoError.message}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    const response = {
      message: `Cleanup completed`,
      total_expired: expiredVideos.length,
      deleted: deletedCount,
      errors: errors.length > 0 ? errors : undefined,
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Cleanup error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 500,
      }
    )
  }
})
