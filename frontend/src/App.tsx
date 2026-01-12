import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import { ResultatPage } from './pages/ResultatPage'
import { ScrollToTop } from './components/ScrollToTop'
import { WardrobeProvider } from './context/WardrobeContext'
import { AuthProvider } from './context/AuthContext'

function HomePage() {
  return (
    <>
      <VintedScraperPage />
      <BeforeAfterSection />
      <TestimonialsSection />
      <PricingSection />
      <BlogSection />
      <FAQSection />
      <VintDressSection />
    </>
  )
}

function App() {
  return (
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
              </Routes>
            </main>
            <Footer />
            <ScrollToTop />
          </div>
        </WardrobeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
