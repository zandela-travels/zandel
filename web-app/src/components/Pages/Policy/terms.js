import React, {useState} from 'react'
import './policy.css'
import logo from '../../Images/nav logom.png'
import axios from 'axios'




const Terms = () => {
  
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
  
    axios.post("http://localhost:8081/contact_us", contactForm)
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

  return (
    <>
      <div id='policy-page'>
        <label className='P-top'>Terms and Conditions</label>
        <dl>
          <dt>Overview</dt>
          <dd>Welcome to Zandela Travels! These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this website, you accept these terms and conditions in full. Do not continue to use Zandela Travels’ website if you do not accept all of the terms and conditions stated on this page.
        </dd>
        </dl>
        <dl>
          <dt>Service Description</dt>
          <dd>Zandela Travels provides a platform for users to register vehicles and book rides. We strive to offer the best vehicles from around the country to fulfill your travel needs. And as recruitment organisation all the Comopanies and Individuals who register to provide services they ARE NOT OUR COMPANY'S EMPLOYEES, They work
             as our contractors. So although you represent as contractors, You will always be monitored by Zandela Travels' administration in order to give our customers the best user experience and to maintain a reliable and friendly relationship between our drivers and our customers.
          </dd>
        </dl>
        <dl>
          <dt>User Account</dt>
          <dd>As part of our commitment to providing accessible services to all customers, we offer user account facilities exclusively to our contractors. When using our website to list your details, please adhere to the following guidelines:<br/>
            <br/>Confidentiality: <br/>
            You are responsible for maintaining the confidentiality of your account information. All activities performed under your account are your responsibility.<br/>
            <br/>Relevant and Clear Information: <br/>
            When posting or editing details through your account, ensure that the information is relevant and clear for our customers. Avoid violating company rules, as any such breaches may result in account termination.<br/>
            <br/>Password Management:<br/>
            Upon creating an account, please remember your password. For security reasons, self-alteration of passwords is not available. If you forget your password, contact us at <span>0781799999</span>. Be prepared for a thorough process to regain account access.<br/>
          </dd>
        </dl>
        <dl>
          <dt>Content Usage</dt>
          <dd>The content displayed on the website is the intellectual property of Zandela Travels. You may not reuse, republish, or reprint such content without our written consent. Any issue related to duplication of content or reuse of content will be subjected to company's legal authorities</dd>
        </dl>
        <dl>
          <dt>Limitation of Liability</dt>
          <dd>Zandela Travels will not be liable for any indirect, special, or consequential loss or damage arising under these terms and conditions or in connection with our website.</dd>
        </dl>
        <dl>
          <dt>Governing Law</dt>
          <dd>These terms and conditions will be governed by and construed in accordance with the laws of the country, without regard to its conflict of law provisions.</dd>
        </dl>
        <dl>
          <dt>Changes to Terms</dt>
          <dd>Zandela Travels reserves the right to modify these terms and conditions at any time. We will notify users of any changes by posting the new terms and conditions on this website.</dd>
        </dl>
        <dl>
          <dt>Contact Us</dt>
          <dd>If you have any questions about these terms and conditions, please contact us using the information provided in the “Contact Information” section on <a href='/Policy'>Privacy&Policy</a> of our website.
          This document was last updated on 2024 June.</dd>
        </dl>

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
          <a className='s-links' href='#'><i className='bx bxl-whatsapp'></i></a>
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
      
    </>
  )
}

export default Terms
