import { useState } from 'react'
import './App.css'
import Home from '../pages/Home/Home.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Trip from '../pages/Trip/Trip.jsx'
import ExpenseTracker from '../pages/ExpenseTracker/ExpenseTracker.jsx'
import Auth from '../pages/Auth/Auth.jsx'
import { Routes, Route, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/Auth";
  return (
    <>
   {!isAuthPage && <Header />}
     <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/Plan-trip" element={<Trip />}/>
          <Route path="/Expense-tracker" element={ <ExpenseTracker /> } />
          <Route path="/Auth" element={ <Auth /> } />
      </Routes>
    {!isAuthPage && <Footer />}
    </>
  )
}

export default App
