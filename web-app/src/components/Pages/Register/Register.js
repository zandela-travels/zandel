import React from 'react'
import { useState, useEffect } from 'react';
import './Register.css'
import gsap from "gsap";
import { useGSAP } from '@gsap/react'
//import RegForm1 from '../../Register form/Regform1';
//import Regform2 from '../../Register form/Regform2';
import IndividualForm from '../../Register form/IndividualForm';
import OrganisationForm from '../../Register form/OrganisationForm';








export default function Register() {
  
  const [Show,setShow]=useState({
    id: "tabbutton"
  })

  useEffect(()=>{
  }, [Show]);

  const toggleDiv = (e) =>{
    e.preventDefault();
    setShow({
      id: e.target.id,
    });
  };

  useGSAP(() => {
    gsap.from('#registerform', {opacity: 0, duration: 1, delay: 0.3, y:10});
  });
  
  
  return (
    <>
     <div id='registerform'>
     <h1 id='caption'>Register Here!</h1>
     <p className='log-link'>If u already have an account. <a href='/login'>Login!</a></p>
      <div id='regform'>
        <div className='instruction'>
          <h2 className='H2'>-INSTRUCTIONS-</h2>
          <ul>
            <li>Fill in all the details correctly.</li>
            <li>When choosing files for your NIC, Lisence images please be thoughtful to upload quality and clear images.</li>
            <li>When filling your details make sure u fill them correctly in each and every field</li>
            <li>After you submit, your vehicle will be listed on the site after 12hrs of sumbmission. But if your information provided are not valid 
              and have some errors in your images we would reject your details and would notify you to register again.
            </li>
            <li>After registration you will recieve a Driver/Company ID and the password you gave when entering your details should be used when logging
              in to your account,<span className='warning'> SO BE THOUGHTFULL TO NOT REVEAL YOUR ACCOUNT INFORMATION TO ANYONE.</span>
            </li>
            <li>After you submit your details you can log into your account and alter every single detail and be thoughtful to upload clear vehicle images so that
              your images will be listed clearly for customers to see.
            </li>
          </ul>
        </div>

        <div className='fomtabs'>
 
        <button style={{ backgroundColor: Show.id === "tabbutton" ? "var(--sub-topic)" : "" }} id='tabbutton' onClick={(e) => toggleDiv(e)}>Individual</button>
        <button style={{ backgroundColor: Show.id === "tabbutton1" ? "var(--sub-topic)" : "" }} id='tabbutton1' onClick={(e) => toggleDiv(e)}>Organisation</button>
          <div id='tabcont' className={Show.id === "tabbutton" ? `tabbutton` : "tabbutton d-none"}>
            <IndividualForm/>
          </div>
        
        <div id='tabcont' className={Show.id === "tabbutton1" ? `tabbutton1` : "tabbutton1 d-none"}>
            <OrganisationForm/>
        </div>
         
        </div>
        
      </div>
     </div>
    </>
  )
}
