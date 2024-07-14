import React, {useState} from 'react'
import './policy.css'
import logo from '../../Images/nav logom.png'
import axios from 'axios'






const Policy = () => {
  
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
        <label className='P-top'>Privacy and Policy</label>
        <dl>
          <dt>Overview</dt>
          <dd>“At Zandela Travels, we prioritize the privacy and security of our users’ personal information. This Privacy Policy details our methods for collecting, using, and safeguarding your data when you visit our website or make a booking. By accessing our services, you agree to the terms outlined in this policy.”</dd>
        </dl>
        <dl>
          <dt>Information Collection</dt>
          <dd>“We collect personal details such as customer names, pickup addresses, and pickup dates and times. For vehicle registration by companies, we require vehicle registration numbers, types, photos, insurance card images, and vehicle registration certificates. Driver registrations necessitate details like names, ID numbers, license numbers, ages, photos, driver’s ID and license card photos.”
          </dd>
        </dl>
        <dl>
          <dt>Use of Information</dt>
          <dd>“The information we collect is used to facilitate your bookings, improve our services, and ensure a seamless travel experience. We may also use your data for internal analytics, service updates, and promotional communications, with your consent.”</dd>
        </dl>
        <dl>
          <dt>Data Security</dt>
          <dd>“We implement robust security measures to protect your personal information from unauthorized access, alteration, or destruction. Our security protocols include encryption, access controls, and regular security assessments.”</dd>
        </dl>
        <dl>
          <dt>User Rights</dt>
          <dd>“You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data. To exercise these rights, please contact us using the information provided below.”</dd>
        </dl>
        <dl>
          <dt>Contact Information</dt>
          <dd> “For any questions or concerns regarding our Privacy Policy or your personal data, please reach out to us at <span>zandelatravels@gmail.com</span> or call us on <span> 0781799999 </span>. Our dedicated team will assist you promptly.”</dd>
        </dl>
        <dl>
          <dt>Updates to Policy</dt>
          <dd>“We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We encourage you to review this policy regularly for the latest information on our privacy practices.”</dd>
        </dl>
        <dl>
          <dt>Effective Date</dt>
          <dd>“This Privacy Policy is effective as of 2024 June. Any changes to our policy will be communicated through our website and, where appropriate, through direct communication with you.”</dd>
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

export default Policy
