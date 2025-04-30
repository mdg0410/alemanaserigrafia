import './App.css'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import ServicesSection from './components/ServicesSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}

export default App
