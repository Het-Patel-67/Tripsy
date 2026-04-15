import { useState } from 'react'
import './App.css'
import Home from '../pages/Home/Home.jsx'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Trip from '../pages/Trip/Trip.jsx'
import ExpenseTracker from '../pages/ExpenseTracker/ExpenseTracker.jsx'
import Hotel from '../pages/Hotel/Hotel.jsx'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
    <Header/>
     <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/Plan-trip" element={<Trip />}/>
          <Route path="/Expense-tracker" element={ <ExpenseTracker /> } />
          <Route path="/Hotels" element={<Hotel />} />
      </Routes>
    <Footer/>
    </>
  )
}

export default App
