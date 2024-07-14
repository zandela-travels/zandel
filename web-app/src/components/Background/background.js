import React, { useState } from 'react'
import './background.css'
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from '@gsap/react'
import img1 from '../Images/money6.png';
import img2 from '../Images/customer.png';
import img3 from '../Images/book2.png';
import logo from '../Images/nav logom.png'
import axios from 'axios';
import img4 from '../Images/AboutImg1.jpg'
import img5 from '../Images/ServicesImg4.jpg'
import { motion, useScroll } from "framer-motion"
import Button from 'react-bootstrap/Button';







 
const Bg = () => {
  const cont1 = useRef();
  const url = process.env.REACT_APP_SERVER;

  const { scrollYProgress } = useScroll();

  const [contactForm, setContactForm] = useState({
    Email: '',
    Message: ''
  })

  const handleChange = (e) => {
    e.preventDefault();
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  
    axios.post(`${url}/contact_us`, contactForm)
      .then(response => {
        if (response.status === 200) {
          alert(response.data.alert);
          setContactForm({
            Email: '',
            Message: ''
          });
        }
      })
      .catch(error => {
        if (error.response) {
          alert(error.response.data.alert);
        } else {
          console.error('Error', error.message);
        }
      });
  }
  
  
  
  useGSAP(() => {
    gsap.from('.text', {opacity: 0, duration: 1, delay: 0.2, y:10});
    gsap.from('.h-topic', {opacity: 0, duration: 1, delay: 0.3, y:10});
    gsap.from('.topic2', {opacity: 0, duration: 1, delay: 0.4, y:10});
    gsap.from('.description', {opacity: 0, duration: 1, delay: 0.5, y:10});
    gsap.from('.links', {opacity: 0, duration: 1, delay: 0.6, y:10});
  });

  
  
  return (
    <>
    <div className='cont1' ref={cont1}>
      <div className="Main-content">
              
        <p className='text'>Welcome to Zandela Travels!</p>
        <h1 className='h-topic'>EXPLORE</h1>
        <h2 className='topic2'>Sri Lanka</h2>
        <p className='description'>Hey wanted to go on an vaccation but don't know how to connect<br/>with a driver to take u there. We got you covered! With
        Zandela Travels your<br/>wait is over. You are now just one call away in enjoying the most joyfull vacation <br/>
        of your life!, So what are u waiting for, Let's have an adventure!
        </p>
        <div className="links">
          <a id='link1' href='Register'>Register/Login as a Driver/Company</a>
          <a id='link2' href='Goride'>Go for a ride</a>
        </div>
      </div>
      <About/>
      <div className='sml-cont'>
      <div className='int-cont'>
      <p className='h-cont'>WHY CHOOSE US!</p>
        <p className='h-txt'>With the oppertunity to select among a variety of Vehicles, Individuals and even Companies,</p>
        <p className='h-txt'>We provide the best travelling experience through our website</p>
        <div className='i-cards'>
        <div className='i-card'>
          <img src={img3} alt='book'/>
          <p className='i-h'>Easy to Book any vehicle of your choice at any time!</p>
          <p className='i-txt'>Easy access to any vehicle, to schedule, to book and cancel any trip</p>
        </div>
        <div className='i-card'>
          <img src={img1} alt='money'/>
          <p className='i-h'>Hand to Hand Payments</p>
          <p className='i-txt'>No Advance or Payments taken before the trip</p>
        </div>
        <div className='i-card'>
          <img src={img2} alt='call'/>
          <p className='i-h'>A Reliable and Supportive Customer Service</p>
          <p className='i-txt'>Ability to contact us () at any time</p>
        </div>
        </div>
      </div>
      </div>
      <Services/>
      <div className='l-cont'>
        <div className='img-cont'>
          <h1 className='l-h'>ENJOY YOUR VACCATION TO THE FULLEST!</h1>
          <Button  variant='warning' href='/Goride'>Book Now</Button>
        </div>
      </div>
      <div className='footer'>
        <div className='footeritem1'>
          <img src={logo}/>
          <p className='f-des'>"We are a leading Company whose determination is to provide the best vehicles
          from all around the country to our valued customers in order to fullfill their needs for a vehicle
          to enjoy their wonderfull getaway with no worries on connecting with a vehicle. We are developing further
          services at the moment to ensure a coverage of all the needs of our customers!"</p>
          <div className='socials'>
          
          <a className='s-links' href='https://www.instagram.com/zandela_travels?igsh=MWsya2g1OGV2enNheQ%3D%3D&utm_source=qr'><i className='bx bxl-instagram'></i></a>
          <a className='s-links' href='https://www.facebook.com/profile.php?id=61561043540061&mibextid=LQQJ4d'><i className='bx bxl-facebook'></i></a>
          
          </div>
          <p className='f-de'>© 2024 Product of Adithya Enterprises. All Rights Reserved</p>
        </div>
        <div className='f-content'>
        <div className='footeritem2'>
          <p className='f-head'>Quick Links</p>
          <div className='q-links'><a href='/'>Home</a>
          <a href='/goride'>Book Now</a>
          <a href='/register'>Register as a Driver/Company</a>
          <a href='/login'>Login (for Driver/Company)</a>
          <a href='/policy'>Privacy and Policy</a>
          <a href='/terms'>Terms and Conditions</a>
        </div>  
        </div>
        <div className='footeritem3'>
          
          <p className='f-head'>Connect With Us!</p>
          <label>Your Email !</label>
          <input
            type='text'
            name='Email'
            value={contactForm.Email} 
            onChange={handleChange}
          />

          <label>Your Message !</label>
          <textarea 
            rows='auto'
            cols='1'
            name='Message'
            value={contactForm.Message} 
            onChange={handleChange}
          />  
          <button className='fbtn' type='submit' value='submit' onClick={handleSubmit}>Submit</button>
        </div>
        </div>
      </div>
    </div>
    </>
  )
}
export default Bg;

const About = () => {
  
  return (
    <>
      <motion.div id='cont2'  initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}>
      <div className='com-cont'>
      <div id='description'>
           <h1>About Us</h1>
           <p>“Zandela Travels is a leading company with a vast number of active drivers working within the organization, 
            covering the entire island. Our goal is to provide our customers with the best travel experience of their lives. 
            Thanks to our associates dedication, we have established a strong foundation among Sri Lanka’s travelers 
            who seek better ways to enjoy their vacations without worrying about transportation facilities. 
            As we like to say, our customers are just ‘one call away’ from fully enjoying their vacation.” </p>
        </div>
        <div id='images'>
        <img src={img4} />
        </div>
      </div>
        
      </motion.div>
    </>
  )
}

const Services = () => {
  

  return (
    <>
      <div id='cont3'>
        <div className='com-cont'>
        <div id='images'>
        <img src={img5} />
        </div>
        <div id='description2'>
        <h1>Our Services</h1>
         <p >"Zandela Travels offers services across various fields, aiming to satisfy our customers during their joyful vacations. 
          With the opportunity to select from a wide range of day-to-day transport vehicles, 
          Zandela Travels makes it much easier for you to contact a driver and embark on your joyful vacation. As for Individuals or Companies 
          longing to work with us, Here's your chance to fullfill our customers requirements by providing them the best and to gain a good recognition through out the country!"</p>
        </div>
        </div>
      </div>
    </>
)
}