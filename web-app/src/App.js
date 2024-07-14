import React from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import {Routes, Route} from 'react-router-dom'
import Home from './components/Pages/Home/Home'
import Login from './components/Pages/Login/Login'
import Goride from './components/Pages/Goride/Goride'
import Error from './components/Pages/Error/Error'
import Register from './components/Pages/Register/Register'
import Aboutvh from './components/Pages/Aboutvh/Aboutvh'
import Organisation from './components/Pages/Organisation/Organisation'
import IndividualForm from './components/Register form/IndividualForm'
import DriverInt from './components/User Interface/DriverInt'
import CompanyInt from './components/User Interface/CompanyInt'
import PGCompany from './components/Payment_Gateway/PGCompany'
import PGIndividual from './components/Payment_Gateway/PGindividual'
import Policy from './components/Pages/Policy/policy'
import Terms from './components/Pages/Policy/terms'
import Admin from './components/Pages/Admin/Admin'



const  App = () => {
  return (
    <>
    <Navbar/>

    <Routes>
    
    <Route path = "/"  element={<Home/>} />
    <Route path="/Goride" element={<Goride/>} />
    <Route path="/Login" element={<Login/>} />
    <Route path="/Register" element={<Register/>} />
    <Route path='/Policy' element={<Policy/>} />
    <Route path='/Terms' element={<Terms/>} />
    <Route path="/Driver/:userId" element={<Aboutvh/>} />
    <Route path="/Regform" element={<IndividualForm/>} />
    <Route path="/individual/:userId" element={<DriverInt/>} />
    <Route path="/PaymentIndividual/:userId" element={<PGIndividual/>} />
    <Route path="/organisation/:companyId" element={<CompanyInt/>} />
    <Route path="/company/:companyId" element={<Organisation/>} />
    <Route path="/PaymentCompany/:companyId" element={<PGCompany/>} />
    <Route path="/Admin" element={<Admin/>} />
    <Route path="*" element={Error} />
    
    </Routes>
    </>
  )
}

export default App;
