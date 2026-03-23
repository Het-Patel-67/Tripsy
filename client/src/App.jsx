import { useState } from 'react'
import './App.css'
import Home from '../pages/Home.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Trip from '../pages/Trip.jsx'
import ExpenseTracker from '../pages/ExpenseTracker.jsx'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
    <Header/>
     <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/Plan-trip" element={<Trip />}/>
          <Route path="/Expense-tracker" element={ <ExpenseTracker /> } />
      </Routes>
    <Footer/>
    </>
  )
}

export default App
