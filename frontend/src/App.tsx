import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { VintedScraperPage } from './components/VintedScraperPage'
import { BeforeAfterSection } from './components/BeforeAfterSection'
import { TestimonialsSection } from './components/TestimonialsSection'
import { PricingSection } from './components/PricingSection'
import { BlogSection } from './components/BlogSection'
import { FAQSection } from './components/FAQSection'
import { VintDressSection } from './components/VintDressSection'
import { FAQPage } from './pages/FAQPage'
import { BlogPage } from './pages/BlogPage'
import { BlogArticlePage } from './pages/BlogArticlePage'
import { ResultatPage } from './pages/ResultatPage'
import { AccountPage } from './pages/AccountPage'
import { MentionsLegalesPage } from './pages/MentionsLegalesPage'
import { PaymentCancelledPage } from './pages/PaymentCancelledPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ScrollToTop } from './components/ScrollToTop'
import { CookieConsent } from './components/CookieConsent'
import { WardrobeProvider } from './context/WardrobeContext'
import { AuthProvider } from './context/AuthContext'

function HomePage() {
  return (
    <>
      <VintedScraperPage />
      <BeforeAfterSection />
      <PricingSection />
      <TestimonialsSection />
      <BlogSection />
      <FAQSection />
      <VintDressSection />
    </>
  )
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <WardrobeProvider>
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E8DFD5' }}>
              <Header />
              <main className="flex-1 pt-12 sm:pt-14">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/resultat" element={<ResultatPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogArticlePage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
                  <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <ScrollToTop />
              <CookieConsent />
            </div>
          </WardrobeProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
