import React, { useState } from 'react'
import './Login.css'
import gsap from "gsap";
import { useGSAP } from '@gsap/react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';




const url = process.env.REACT_APP_SERVER;

const Login = () => {

  const [toggle, setToggle] = useState(1);
  const navigate = useNavigate('');

  const toggleTab = (index) => {
    setToggle(index);
  }

  useGSAP(() => {
    gsap.from('.form-element', {opacity: 0, duration: 1, delay: 0.05, y:10});
  
  });

  return (
    <>
     
     <div className='form-element'>

      <div className='loginform'>

        <h1 className='legend'>Login</h1>

        <div className='tabs-container'>
          <div className={toggle === 1 ? "tabz active-tab" : "tabz"}  onClick={() => toggleTab(1)}>Individual</div> 
          <div className={toggle === 2 ? "tabz active-tab" : "tabz"} onClick={() => toggleTab(2)}>Company</div>
        </div>

        <div className={toggle === 1 ? "content active-content" : "content"}><IndividualLogin/></div>
        <div className={toggle === 2 ? "content active-content" : "content"}><CompanyLogin/></div>
        <div className={toggle === 3 ? "content active-content" : "content"}></div>

        <p className='link'>Don't have an account? {''}<a href='Register' className='reglink'>Register Here!</a></p>

      </div>

     </div>
      
    </>
  )
}

export default Login;



const IndividualLogin = () => {
  
  const navigate = useNavigate('');
  axios.defaults.withCredentials = true;
  
  const [values, setValues] = useState({
    idNumber: '',
    password: ''
  })

  const handleChange = (e) => {
    e.preventDefault();
  
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const [errors, setErrors] = useState({})

  const validateForm = () =>{
    let formErrors = {};
    // validation logic 

    if(values.idNumber === ""){
      formErrors.idNumber = "Driver Id Number is required"
    }

    if(values.password === ""){
    formErrors.password = "Password is required" 
    }
  
    return formErrors

  }

  const handleSubmit = async (e) => {
    const formErrors = validateForm(values);
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      try {
        const res = await axios.post(`${url}/login_individual`, {
          nationalIdNumber: values.idNumber,
          password: values.password
        });
  
        if (res && res.data.Status === "admin") {
          // Navigate to the admin page
          navigate('/Admin');
        } else if (res && res.data.Status === "user") {
          navigate(`/individual/DriverNo${res.data.id}`);
        } else {
          alert('Invalid national ID number or password');
        }
      } catch (error) {
        let errorMessage = 'An error occurred. Please try again later.';
        if (error.response && error.response.data && error.response.data.Error) {
          errorMessage = error.response.data.Error;
        }
        setErrors({ server: errorMessage });
      }
    }
  };
  
  
  
  
  

  return (
    <>
     
     <div className='form-container'>

        <p className='labelcap'>Driver ID Number <i className='bx bx-user-circle'></i></p>
        <input 
          className='input-box'
          type='text'
          name='idNumber'
          onChange={handleChange}
        />
        {errors.idNumber && <div className='loginerrors'>{errors.idNumber}</div>}

        <p className='labelcap'>Password <i className='bx bx-shield-quarter'></i></p>
        <input 
          className='input-box'
          type='password'
          name='password'
          onChange={handleChange}
        />
        {errors.password && <div className='loginerrors'>{errors.password}</div>}

        <button className='loginbtn' type='submit' value='submit' onClick={handleSubmit}>Submit</button>
        {errors.server && <div className='loginerrors'>{errors.server}</div>}

        </div>
      
    </>
  )

}


 const CompanyLogin = () => {

  const navigate = useNavigate('');
  axios.defaults.withCredentials = true;

  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    e.preventDefault();
  
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const [errors, setErrors] = useState({})

  const validateForm = () =>{
    let formErrors = {};
    // validation logic 

    if(values.email === ""){
      formErrors.email = "Company Email is required"
    }

    if(values.password === ""){
    formErrors.password = "Password is required" 
    }
  
    return formErrors

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm(values);
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      let res;
      try {
        res = await axios.post(`${url}/login_company`, {
          companyEmail: values.email,
          password: values.password
        });
        if (res && res.data.Status === "Success") {
          navigate(`/organisation/CompanyNo${res.data.id}`);
          return;
        } else {
          // Display alert for invalid username or password
          alert('Invalid username or password');
        }
      } catch (error) {
        let errorMessage = 'An error occurred. Please try again later.';
        if (error.response && error.response.data && error.response.data.Error) {
          errorMessage = error.response.data.Error;
        }
        setErrors({ server: errorMessage });
        return;
      }
    }
  }
  
  
  return (
    <>
     
     <div className='form-container'>

        <p className='labelcap'>Company Email <i className='bx bx-user-circle'></i></p>
        <input 
          className='input-box'
          type='text'
          name='email'
          onChange={handleChange}
        />
        {errors.email && <div className='loginerrors'>{errors.email}</div>}

        <p className='labelcap'>Password <i className='bx bx-shield-quarter'></i></p>
        <input 
          className='input-box'
          type='password'
          name='password'
          onChange={handleChange}
        />
        {errors.password && <div className='loginerrors'>{errors.password}</div>}

        <button className='loginbtn' type='submit' value='submit' onClick={handleSubmit}>Submit</button>
        {errors.server && <div className='loginerrors'>{errors.server}</div>}

     </div>
      
    </>
  )

 }
