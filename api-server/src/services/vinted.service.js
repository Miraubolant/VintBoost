/**
 * Service Vinted
 * Gère l'authentification et les appels API vers Vinted
 */

const puppeteerService = require('./puppeteer.service')
const config = require('../config')

class VintedService {
  /**
   * Récupère une session Vinted (cookies + CSRF token)
   */
  async getSession(domain) {
    console.log('[AUTH] Getting Vinted session...')
    const browser = await puppeteerService.launchBrowser()

    try {
      const page = await puppeteerService.createPage(browser)

      // Aller sur la page d'accueil pour obtenir les cookies
      await page.goto(domain, { waitUntil: 'networkidle2', timeout: 30000 })
      await new Promise(r => setTimeout(r, 2000))

      // Récupérer les cookies
      const cookies = await page.cookies()
      const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ')

      // Chercher le CSRF token dans la page
      const csrfToken = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="csrf-token"]')
        return meta?.content || ''
      })

      console.log('[AUTH] Session obtained')
      return { cookieString, csrfToken, cookies }

    } finally {
      await browser.close()
    }
  }

  /**
   * Appelle l'API Vinted avec la session
   */
  async callAPI(endpoint, session, domain) {
    const url = `${domain}/api/v2${endpoint}`
    console.log(`[API] Calling ${url}`)

    const response = await fetch(url, {
      headers: {
        'User-Agent': config.scraper.userAgent,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Cookie': session.cookieString,
        'X-CSRF-Token': session.csrfToken,
        'Referer': domain,
        'Origin': domain
      }
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Récupère les informations d'un utilisateur
   */
  async getUserInfo(userId, session, domain) {
    console.log(`[USER API] >>> Getting user info for userId: ${userId}`)
    try {
      const data = await this.callAPI(`/users/${userId}`, session, domain)
      console.log('[USER API] >>> API response received:', data ? 'OK' : 'EMPTY')
      const user = data.user || data || {}

      // Log toutes les données brutes pour debug
      console.log('[USER API] Raw user data keys:', Object.keys(user))
      console.log('[USER API] Full user data:', JSON.stringify(user, null, 2))

      return {
        // Identité
        username: user.login || user.username || '',
        id: Number(userId),
        anonId: user.anon_id || '',
        realName: user.real_name || '',
        profilePicture: user.photo?.full_size_url || user.photo?.url || '',
        profilePictureThumb: user.photo?.thumbnails?.[0]?.url || user.photo?.url || '',
        profileUrl: user.profile_url || '',
        shareProfileUrl: user.share_profile_url || '',

        // Stats sociaux
        followersCount: user.followers_count || 0,
        followingCount: user.following_count || 0,
        followingBrandsCount: user.following_brands_count || 0,

        // Articles
        itemsCount: user.item_count || 0,
        totalItemsCount: user.total_items_count || 0,
        soldItemsCount: user.given_item_count || 0,
        boughtItemsCount: user.taken_item_count || 0,

        // Feedback/Avis
        feedbackCount: user.feedback_count || 0,
        positiveFeedbackCount: user.positive_feedback_count || 0,
        negativeFeedbackCount: user.negative_feedback_count || 0,
        neutralFeedbackCount: user.neutral_feedback_count || 0,
        feedbackReputation: user.feedback_reputation || 0,
        feedbackReputationPercent: Math.round((user.feedback_reputation || 0) * 100),

        // Vérifications
        verifications: {
          email: user.verification?.email?.valid || false,
          facebook: user.verification?.facebook?.valid || false,
          google: user.verification?.google?.valid || false,
          googleVerifiedAt: user.verification?.google?.verified_at || null
        },

        // Localisation
        city: user.city || '',
        cityId: user.city_id || null,
        countryCode: user.country_code || '',
        countryId: user.country_id || null,
        countryTitle: user.country_title || '',
        countryTitleLocal: user.country_title_local || '',
        locationDescription: user.location_description || '',

        // Activité
        lastLoggedTs: user.last_loged_on_ts || null,
        lastLoggedText: user.last_loged_on || '',
        isOnline: user.is_online || false,
        updatedOn: user.updated_on || null,

        // A propos
        about: user.about || '',
        birthday: user.birthday || null,

        // Business
        isBusinessAccount: user.business || false,
        businessAccountId: user.business_account_id || null,
        businessAccount: user.business_account || null,

        // Paramètres
        canBundle: user.can_bundle || false,
        bundleDiscount: user.bundle_discount || null,
        isOnHoliday: user.is_on_holiday || false,
        allowDirectMessaging: user.allow_direct_messaging || false,

        // Stats avancés
        avgResponseTime: user.avg_response_time || null,
        msgTemplateCount: user.msg_template_count || 0,

        // Statut compte
        accountStatus: user.account_status || 0,
        isAccountBanned: user.is_account_banned || false,
        isModerator: user.moderator || false,

        // Devise
        currency: user.currency || 'EUR',
        locale: user.locale || 'fr',

        // Raw data pour debug (à retirer en prod)
        _rawData: user
      }
    } catch (e) {
      console.log('[USER API] >>> ERROR getting user info:', e.message)
      console.log('[USER API] >>> Full error:', e)
      return {
        username: '',
        id: Number(userId),
        anonId: '',
        realName: '',
        profilePicture: '',
        profilePictureThumb: '',
        profileUrl: '',
        shareProfileUrl: '',
        followersCount: 0,
        followingCount: 0,
        followingBrandsCount: 0,
        itemsCount: 0,
        totalItemsCount: 0,
        soldItemsCount: 0,
        boughtItemsCount: 0,
        feedbackCount: 0,
        positiveFeedbackCount: 0,
        negativeFeedbackCount: 0,
        neutralFeedbackCount: 0,
        feedbackReputation: 0,
        feedbackReputationPercent: 0,
        verifications: { email: false, facebook: false, google: false, googleVerifiedAt: null },
        city: '',
        cityId: null,
        countryCode: '',
        countryId: null,
        countryTitle: '',
        countryTitleLocal: '',
        locationDescription: '',
        lastLoggedTs: null,
        lastLoggedText: '',
        isOnline: false,
        updatedOn: null,
        about: '',
        birthday: null,
        isBusinessAccount: false,
        businessAccountId: null,
        businessAccount: null,
        canBundle: false,
        bundleDiscount: null,
        isOnHoliday: false,
        allowDirectMessaging: false,
        avgResponseTime: null,
        msgTemplateCount: 0,
        accountStatus: 0,
        isAccountBanned: false,
        isModerator: false,
        currency: 'EUR',
        locale: 'fr',
        _rawData: null
      }
    }
  }

  /**
   * Récupère tous les items d'un utilisateur via pagination
   */
  async getWardrobeItems(userId, session, domain) {
    const allItems = []
    let page = 1
    const perPage = config.scraper.perPage
    const endpoint = `/wardrobe/${userId}/items?page={page}&per_page=${perPage}&order=relevance`

    // Première page
    try {
      const testUrl = endpoint.replace('{page}', '1')
      console.log(`[SCRAPE] Calling endpoint: ${testUrl}`)
      const data = await this.callAPI(testUrl, session, domain)

      if (data.items && data.items.length > 0) {
        allItems.push(...data.items)
        console.log(`[SCRAPE] Success! Got ${data.items.length} items from page 1`)
      } else {
        throw new Error('No items found')
      }
    } catch (e) {
      console.log(`[SCRAPE] Endpoint failed: ${e.message}`)
      throw e
    }

    // Pages suivantes
    page = 2
    while (page <= config.scraper.maxPages) {
      try {
        console.log(`[SCRAPE] Fetching page ${page}...`)
        const data = await this.callAPI(
          endpoint.replace('{page}', String(page)),
          session,
          domain
        )

        const items = data.items || []
        if (items.length === 0) break

        allItems.push(...items)
        console.log(`[SCRAPE] Page ${page}: got ${items.length} items (total: ${allItems.length})`)

        if (items.length < perPage) break
        page++

        await new Promise(r => setTimeout(r, config.scraper.requestDelay))

      } catch (e) {
        console.log(`[SCRAPE] API error on page ${page}:`, e.message)
        break
      }
    }

    return allItems
  }
}

module.exports = new VintedService()
