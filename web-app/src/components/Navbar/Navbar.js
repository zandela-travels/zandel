import React, { useState } from 'react'
import './Navbar.css'
import navlogo from '../Images/nav logom.png'
import { NavLink } from 'react-router-dom'
import gsap from "gsap"
import { useGSAP } from '@gsap/react'
import Dropdown from 'react-bootstrap/Dropdown';
import AnchorLink from "react-anchor-link-smooth-scroll";







export default function Navbar() {
  
  return (
    <>
    <div className='div'>
    <div className="container-bar">
      <div className="logocontainer">
        <img src={navlogo} alt="logo" className='navlogo' />
      </div>
      <nav>

      <Dropdown data-bs-theme="dark">
      <Dropdown.Toggle variant="outline-warning" id="dropdown-basic" size='sm'>
        Menu
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="/">Home</Dropdown.Item>
        <Dropdown.Item href="/Goride">Book Now</Dropdown.Item>
        <Dropdown.Item href="/Terms">Terms & Conditions</Dropdown.Item>
        <Dropdown.Item href="/Policy">Privacy & Policy</Dropdown.Item>
      </Dropdown.Menu>
      </Dropdown>
 
        <div className= 'navlinks'>
          
        <NavLink to='/' className={({ isActive }) => isActive ? "navitem activeitem" : "navitem"}>Home</NavLink>
        <NavLink to='/Goride' className={({ isActive }) => isActive ? "navitem activeitem" : "navitem"}>Book Now</NavLink>
        <NavLink to='/Policy' className={({ isActive }) => isActive ? "navitem activeitem" : "navitem"}>Privacy & Policy</NavLink>
        <NavLink to='/Terms' className={({ isActive }) => isActive ? "navitem activeitem" : "navitem"}>Terms & Conditions</NavLink>
        
        </div>
        
      </nav>
    </div>
    </div>
      
    
    </>
  )
}
