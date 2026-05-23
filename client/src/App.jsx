import { useState } from 'react'
import './App.css'
import Home from '../pages/Home/Home.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Trip from '../pages/Trip/Trip.jsx'
import ExpenseTracker from '../pages/ExpenseTracker/ExpenseTracker.jsx'
import Auth from '../pages/Auth/Auth.jsx'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import MyItineraries from '../pages/Myitineraries/MyItineraries.jsx';
import ScrollToTop from './utils/ScrollToTop.js'
import { AuthProvider } from './context/Authcontext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PrivacyPolicy from '../pages/Support/PrivacyPolicy.jsx'
import Contact from '../pages/Support/Contact.jsx'
import TermsAndConditions from '../pages/Support/TermsAndConditions.jsx'

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  return (
    <>
    <AuthProvider>
      
      {!isAuthPage && <Header />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan-trip" element={<ProtectedRoute><Trip /></ProtectedRoute>} />
        <Route path="/expense-tracker" element={<ProtectedRoute><ExpenseTracker /></ProtectedRoute>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/my-itineraries" element={<ProtectedRoute><MyItineraries /></ProtectedRoute>} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAuthPage && <Footer />}
     
    </AuthProvider>
    </>
  )
}

export default App
