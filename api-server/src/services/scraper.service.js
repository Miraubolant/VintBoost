/**
 * Service Scraper
 * Orchestre le scraping d'un vestiaire Vinted
 */

const vintedService = require('./vinted.service')
const puppeteerService = require('./puppeteer.service')

class ScraperService {
  /**
   * Extrait l'userId depuis une URL Vinted
   */
  extractUserId(url) {
    const userIdMatch = url.match(/\/members?\/(\d+)/)
    if (!userIdMatch) {
      throw new Error('User ID not found in URL')
    }
    return userIdMatch[1]
  }

  /**
   * Formate un item Vinted
   */
  formatItem(item, domain) {
    // Déterminer le statut
    let status = 'active'
    if (item.is_closed) status = 'sold'
    else if (item.is_reserved) status = 'reserved'
    else if (item.is_hidden) status = 'hidden'

    return {
      id: String(item.id),
      title: item.title || '',
      price: item.price?.amount || item.price || '',
      currency: item.price?.currency_code || 'EUR',
      imageUrl: item.photo?.url || item.photos?.[0]?.url || '',
      images: (item.photos || []).slice(0, 5).map(p => p.url || p.full_size_url),
      itemUrl: `${domain}/items/${item.id}`,
      brand: item.brand || '',
      size: item.size_title || item.size || '',
      color: item.color1 || item.colour1 || '',
      condition: item.status || '',
      status,
      isSold: item.is_closed || false,
      isReserved: item.is_reserved || false
    }
  }

  /**
   * Déduplique les items par ID
   */
  deduplicateItems(items) {
    const uniqueItems = []
    const seenIds = new Set()

    for (const item of items) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id)
        uniqueItems.push(item)
      }
    }

    return uniqueItems
  }

  /**
   * Compte les items par statut
   */
  countByStatus(items) {
    return {
      active: items.filter(i => i.status === 'active').length,
      sold: items.filter(i => i.status === 'sold').length,
      reserved: items.filter(i => i.status === 'reserved').length
    }
  }

  /**
   * Scrape un vestiaire via l'API Vinted
   */
  async scrapeViaAPI(url) {
    const urlObj = new URL(url)
    const domain = urlObj.origin
    const userId = this.extractUserId(url)

    console.log(`[SCRAPE] Scraping wardrobe for user ${userId}`)

    // Obtenir la session
    const session = await vintedService.getSession(domain)

    // Récupérer les infos utilisateur
    const userInfo = await vintedService.getUserInfo(userId, session, domain)

    // Récupérer tous les items
    const allItems = await vintedService.getWardrobeItems(userId, session, domain)

    if (allItems.length === 0) {
      throw new Error('No items found')
    }

    console.log(`[SCRAPE] Total items from API: ${allItems.length}`)

    // Dédupliquer
    const uniqueItems = this.deduplicateItems(allItems)
    console.log(`[SCRAPE] Unique items: ${uniqueItems.length}`)

    // Formater
    const formattedItems = uniqueItems.map(item => this.formatItem(item, domain))

    // Compter par statut
    const counts = this.countByStatus(formattedItems)
    console.log(`[SCRAPE] Status counts: active=${counts.active}, sold=${counts.sold}, reserved=${counts.reserved}`)

    return {
      success: true,
      username: userInfo.username,
      userId,
      userInfo: {
        // Identité
        profilePicture: userInfo.profilePicture,
        profilePictureThumb: userInfo.profilePictureThumb,
        profileUrl: userInfo.profileUrl,
        shareProfileUrl: userInfo.shareProfileUrl,
        anonId: userInfo.anonId,
        realName: userInfo.realName,

        // Stats sociaux
        followersCount: userInfo.followersCount,
        followingCount: userInfo.followingCount,
        followingBrandsCount: userInfo.followingBrandsCount,

        // Articles
        itemsCount: userInfo.itemsCount,
        totalItemsCount: userInfo.totalItemsCount,
        soldItemsCount: userInfo.soldItemsCount,
        boughtItemsCount: userInfo.boughtItemsCount,

        // Feedback/Avis
        feedbackCount: userInfo.feedbackCount,
        positiveFeedbackCount: userInfo.positiveFeedbackCount,
        negativeFeedbackCount: userInfo.negativeFeedbackCount,
        neutralFeedbackCount: userInfo.neutralFeedbackCount,
        feedbackReputation: userInfo.feedbackReputation,
        feedbackReputationPercent: userInfo.feedbackReputationPercent,

        // Vérifications
        verifications: userInfo.verifications,

        // Localisation
        city: userInfo.city,
        cityId: userInfo.cityId,
        countryCode: userInfo.countryCode,
        countryId: userInfo.countryId,
        countryTitle: userInfo.countryTitle,
        countryTitleLocal: userInfo.countryTitleLocal,
        locationDescription: userInfo.locationDescription,

        // Activité
        lastLoggedTs: userInfo.lastLoggedTs,
        lastLoggedText: userInfo.lastLoggedText,
        isOnline: userInfo.isOnline,
        updatedOn: userInfo.updatedOn,

        // A propos
        about: userInfo.about,
        birthday: userInfo.birthday,

        // Business
        isBusinessAccount: userInfo.isBusinessAccount,
        businessAccountId: userInfo.businessAccountId,
        businessAccount: userInfo.businessAccount,

        // Paramètres
        canBundle: userInfo.canBundle,
        bundleDiscount: userInfo.bundleDiscount,
        isOnHoliday: userInfo.isOnHoliday,
        allowDirectMessaging: userInfo.allowDirectMessaging,

        // Stats avancés
        avgResponseTime: userInfo.avgResponseTime,
        msgTemplateCount: userInfo.msgTemplateCount,

        // Statut compte
        accountStatus: userInfo.accountStatus,
        isAccountBanned: userInfo.isAccountBanned,
        isModerator: userInfo.isModerator,

        // Devise
        currency: userInfo.currency,
        locale: userInfo.locale
      },
      totalItems: formattedItems.length,
      scrapedAt: new Date().toISOString(),
      items: formattedItems
    }
  }

  /**
   * Scrape un vestiaire via HTML (fallback)
   */
  async scrapeViaHTML(url) {
    console.log('[SCRAPE] Falling back to HTML scraping...')
    const browser = await puppeteerService.launchBrowser()

    try {
      const page = await puppeteerService.createPage(browser)
      await page.setViewport({ width: 1920, height: 1080 })
      await puppeteerService.setupRequestInterception(page)

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await new Promise(r => setTimeout(r, 3000))

      // Scroll pour charger tous les items
      console.log('[SCRAPE] Scrolling to load all items...')
      let previousCount = 0
      let sameCountTimes = 0

      while (sameCountTimes < 3) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        await new Promise(r => setTimeout(r, 1500))

        const currentCount = await page.evaluate(() => {
          const ids = new Set()
          document.querySelectorAll('a[href*="/items/"]').forEach(link => {
            const match = link.href.match(/\/items\/(\d+)/)
            if (match) ids.add(match[1])
          })
          return ids.size
        })

        console.log(`[SCRAPE] Found ${currentCount} items so far...`)

        if (currentCount === previousCount) {
          sameCountTimes++
        } else {
          sameCountTimes = 0
          previousCount = currentCount
        }

        await page.evaluate(() => window.scrollBy(0, 500))
        await new Promise(r => setTimeout(r, 800))
      }

      // Extraire les données
      const { items, username, userInfo } = await page.evaluate(() => {
        const extractedItems = []
        const seenIds = new Set()

        document.querySelectorAll('a[href*="/items/"]').forEach(link => {
          const match = link.href.match(/\/items\/(\d+)/)
          if (!match || seenIds.has(match[1])) return

          const id = match[1]
          seenIds.add(id)

          let container = link
          for (let i = 0; i < 5; i++) {
            container = container.parentElement
            if (!container) break
            if (container.children.length >= 2) break
          }

          const img = link.querySelector('img') || container?.querySelector('img')
          const imageUrl = img?.src?.replace(/\/\d+x\d+\//, '/f800/') || ''

          let price = ''
          let priceText = container?.textContent || link.textContent || ''
          const priceMatch = priceText.match(/(\d+(?:[,\.]\d+)?)\s*€/)
          if (priceMatch) {
            price = priceMatch[1].replace(',', '.')
          }

          let title = img?.alt || link.title || ''
          if (!title) {
            const textEls = container?.querySelectorAll('p, span, div') || []
            for (const el of textEls) {
              const text = el.textContent?.trim()
              if (text && text.length > 10 && !text.includes('€') && text !== price) {
                title = text
                break
              }
            }
          }

          let brand = ''
          const brandLink = container?.querySelector('a[href*="/brand/"]')
          if (brandLink) {
            brand = brandLink.textContent?.trim() || ''
          }

          let size = ''
          const sizeMatch = priceText.match(/Taille[\s:]*([^\n€]+)/i) ||
                           priceText.match(/\b(XS|S|M|L|XL|XXL|\d+)\b/)
          if (sizeMatch) {
            size = sizeMatch[1]?.trim() || ''
          }

          extractedItems.push({
            id,
            title: title.substring(0, 100),
            price,
            imageUrl,
            brand,
            size
          })
        })

        // Extraire username
        const usernameEl = document.querySelector('h1') || document.querySelector('[data-testid="user-login"]')
        const extractedUsername = usernameEl?.textContent?.trim()?.split('\n')[0] || ''

        // Extraire les infos utilisateur depuis la page
        const extractUserInfo = () => {
          // Photo de profil
          const profileImg = document.querySelector('img[alt*="photo"]') ||
                            document.querySelector('[class*="profile"] img') ||
                            document.querySelector('[class*="avatar"] img')
          const profilePicture = profileImg?.src || ''

          // Chercher les stats dans le texte de la page
          const pageText = document.body.innerText || ''

          // Followers
          const followersMatch = pageText.match(/(\d+)\s*(?:abonné|follower|suiveur)/i)
          const followersCount = followersMatch ? parseInt(followersMatch[1]) : 0

          // Following
          const followingMatch = pageText.match(/(\d+)\s*(?:abonnement|following|suivi)/i)
          const followingCount = followingMatch ? parseInt(followingMatch[1]) : 0

          // Avis/Feedback
          const feedbackMatch = pageText.match(/(\d+)\s*(?:avis|évaluation|feedback|review)/i)
          const feedbackCount = feedbackMatch ? parseInt(feedbackMatch[1]) : 0

          // Articles vendus
          const soldMatch = pageText.match(/(\d+)\s*(?:vendu|sold)/i)
          const soldItemsCount = soldMatch ? parseInt(soldMatch[1]) : 0

          // Localisation
          let city = ''
          const locationEl = document.querySelector('[class*="location"]') ||
                            document.querySelector('[data-testid*="location"]')
          if (locationEl) {
            city = locationEl.textContent?.trim() || ''
          }

          return {
            profilePicture,
            followersCount,
            followingCount,
            itemsCount: extractedItems.length,
            soldItemsCount,
            feedbackCount,
            positiveFeedbackCount: feedbackCount,
            feedbackReputation: feedbackCount > 0 ? 100 : 0,
            verifications: { email: false, phone: false, facebook: false, google: false },
            city,
            countryCode: '',
            lastLogged: null,
            createdAt: null
          }
        }

        return {
          items: extractedItems,
          username: extractedUsername,
          userInfo: extractUserInfo()
        }
      })

      const domain = new URL(url).origin
      const userId = this.extractUserId(url)

      return {
        success: true,
        username,
        userId,
        userInfo,
        totalItems: items.length,
        scrapedAt: new Date().toISOString(),
        items: items.map(item => ({
          ...item,
          currency: 'EUR',
          images: item.imageUrl ? [item.imageUrl] : [],
          itemUrl: `${domain}/items/${item.id}`,
          color: '',
          condition: '',
          status: 'active',
          isSold: false,
          isReserved: false
        }))
      }

    } finally {
      await browser.close()
    }
  }

  /**
   * Scrape un vestiaire (essaie l'API, puis HTML en fallback)
   */
  async scrape(url) {
    try {
      return await this.scrapeViaAPI(url)
    } catch (error) {
      console.log('[SCRAPE] API approach failed:', error.message)
      return await this.scrapeViaHTML(url)
    }
  }
}

module.exports = new ScraperService()
