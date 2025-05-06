import { lazy, Suspense } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy loading para componentes pesados
const AboutSection = lazy(() => import('./components/AboutSection'));
const ServicesSection = lazy(() => import('./components/ServicesSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const Footer = lazy(() => import('./components/Footer'));
const ChatBot = lazy(() => import('./components/ChatBot'));

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={<LoadingSpinner />}>
          <AboutSection />
          <ServicesSection />
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
    </div>
  );
}

export default App;
