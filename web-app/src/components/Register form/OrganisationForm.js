import React from 'react'
import './Regform.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';





const Input = ({id, type, name, onChange, onBlur }) => (
    <input id={id} type={type} name={name} onChange={onChange} onBlur={onBlur} />
  
  );
  
  const FileInput = ({ name, onChange, onBlur }) => (
    <input type="file" name={name} onChange={onChange} onBlur={onBlur} />
  
  );


  const url = process.env.REACT_APP_SERVER;




const OrganisationForm = () => {
    
    const navigate = useNavigate('');
    const [errors, setErrors] = useState({});
    const [form2, setForm2] = useState({
        password: '',
        companyName: '',
        companyAddressLine1: '',
        companyAddressLine2: '',
        yearOfEstablishment: '',
        companyPhno1: '',
        companyPhno2: '',
        companyEmail: '',
        rental_stat: ''
    })

    const handleChange = (e) => {
        
        e.preventDefault();
        
        setForm2({
          ...form2,
          [e.target.name]: e.target.value,
        });
        const formErrors = validateForm(form2);
        setErrors(formErrors);
      };
    
      const [files, setFiles] = useState({
        driverDetails: null,
        vehicleDetails: null,
      });
      
      // Update the handleFileChange function
      const handleFileChange = (e) => {
        const file = e.target.files[0];
        const error = validateFile(file);
      
        if (error) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [e.target.name]: error,
          }));
        } else {
          setFiles((prevFiles) => ({
            ...prevFiles,
            [e.target.name]: file,
          }));
        }
      };
      

      const validateFile = (file) => {
        const fileTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
        if (!file) {
          return 'Select a File';
        }
        else if (!fileTypes.includes(file.type)){
           return 'Invalid file type. Only doc, docx, and pdf files are allowed.';
        }
        return null;
      };
      
      
      const validateForm = () => {
        let formErrors = {};
      
        const password_pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*(_|[^\w])).{8,20}$/;
        const email_pattern = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;
        const phno_pattern1 = /^[0]{1}[7]{1}[01245678]{1}[0-9]{7}$/;
        const phno_pattern2 = /0((11)|(2(1|[3-7]))|(3[1-8])|(4(1|5|7))|(5(1|2|4|5|7))|(6(3|[5-7]))|([8-9]1))[0-9]{7}/
      
        // Validate password
        if (!form2.password) {
          formErrors.password = 'Password is required';
        }else if(!password_pattern.test(form2.password)){
          formErrors.password = 'Password should contain minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character:'
        }
      
        // Validate companyName
        if (!form2.companyName) {
          formErrors.companyName = 'Company name is required';
        }

        if(!form2.rental_stat){
          formErrors.rental_stat = "Rental status is required"
       }
      
        if (!form2.companyAddressLine1) {
          formErrors.companyAddressLine1 = 'Company address line 1 is required';
        }
      
        if (!form2.companyAddressLine2) {
          formErrors.companyAddressLine2 = 'Company address line 2 is required';
        }
      
        if (!form2.yearOfEstablishment) {
          formErrors.yearOfEstablishment = 'Year of establishment is required';
        }
      
        if (!form2.companyPhno1) {
          formErrors.companyPhno1 = 'Company phone number 1 is required';
        }else if(!phno_pattern1.test(form2.companyPhno1) && !phno_pattern2.test(form2.companyPhno1)){
          formErrors.companyPhno1 = 'Invalid Phone number'
        }
      
        if (!form2.companyPhno2) {
          formErrors.companyPhno2 = 'Company phone number 2 is required';
        }else if(!phno_pattern1.test(form2.companyPhno2) && !phno_pattern2.test(form2.companyPhno2)){
          formErrors.companyPhno2 = 'Invalid Phone number'
        }

        if (!form2.companyEmail) {
          formErrors.companyEmail = 'Company Email is required';
        }else if(!email_pattern.test(form2.companyEmail)){
          formErrors.companyEmail = 'Invalid Email format'
        }
      
        
        return formErrors;
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0 || Object.keys(errors).length > 0) {
          setErrors({ ...formErrors, ...errors });
          return;
        }
      
        const formData = new FormData();
        Object.keys(form2).forEach((key) => {
          formData.append(key, form2[key]);
        });
      
        // Append the files separately
        Object.keys(files).forEach((key) => {
          if (files[key]) {
            formData.append(key, files[key], files[key].name);
          }
        });
    
        axios.post(`${url}/register_company`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(async (response) => {
            if(response.data.Status === 'Success') {
                alert(`Company details submitted successfully. Your Company ID is ${response.data.CompanyId}`);
                setForm2({});
                navigate('/login');
            }
        })
        .catch(err => {
            if (err.response && err.response.data && err.response.data.Error) {
                setErrors(prevErrors => ({
                  ...prevErrors,
                  Error: err.response.data.Error
                }));
            }
        }); 
      
      };
      
  
    return (
    <>

    <form onSubmit={handleSubmit}>
      <div id='tabs'>

        <div id='tab'>

            <legend>Company details</legend>

            <label className='f-label'>Company Name</label>
            <Input
                type='text'
                name='companyName'
                onChange={handleChange}
                onBlur={handleChange}
            />
            {errors.companyName && <p className="error">{errors.companyName}</p>}

            <label className='f-label'>Company Location</label>
            
            <p>Address Line 1:</p>
            <Input
                type='text'
                name='companyAddressLine1'
                onChange={handleChange}
                onBlur={handleChange}
            />
            {errors.companyAddressLine1 && <p className="error">{errors.companyAddressLine1}</p>}

            <p>Address Line 2:</p>
            <Input
                type='text'
                name='companyAddressLine2'
                onChange={handleChange}
                onBlur={handleChange}
            />
            {errors.companyAddressLine2 && <p className="error">{errors.companyAddressLine2}</p>}

            <label className='f-label'>Company Establishment Year:</label>
            <Input
                type='date'
                name='yearOfEstablishment'
                onChange={handleChange}
                onBlur={handleChange}
            />    
            {errors.yearOfEstablishment && <p className="error">{errors.yearOfEstablishment}</p>}

            <label className='f-label'>Company Contact Numbers</label>
            
            <p>Contact Number 1:</p>
            <Input
                type='text'
                name='companyPhno1'
                onChange={handleChange}
                onBlur={handleChange}
            />
            {errors.companyPhno1 && <p className="error">{errors.companyPhno1}</p>}

            <p>Contact Number 2:</p>
            <Input
                type='text'
                name='companyPhno2'
                onChange={handleChange}
                onBlur={handleChange}
            />
            {errors.companyPhno2 && <p className="error">{errors.companyPhno2}</p>}

            <label className='f-label'>Company Email:</label>
            <Input
                type='email'
                name='companyEmail'
                onChange={handleChange}
                onBlur={handleChange}
            />
            {errors.companyEmail && <p className="error">{errors.companyEmail}</p>}

            <label className='f-label'>Insert Your Driver Details pdf</label>
            <FileInput 
              name='driverDetails'
              onChange={handleFileChange}
              onBlur={handleChange}
            />
            {errors.driverDetails && <p className='error'>{errors.driverDetails}</p>}

            <label className='f-label'>Insert Your Vehicle Details pdf</label>
            <FileInput 
              name='vehicleDetails'
              onChange={handleFileChange}
              onBlur={handleChange}
            />
            {errors.vehicleDetails && <p className='error'>{errors.vehicleDetails}</p>}

            <label>Do you Rent Your Vehicles ?</label>
                <select id="Type-of-vehicle" name="rental_stat"  onChange={handleChange} onBlur={handleChange} >
                  <option value="Rental">Available for Rentals</option>
                  <option value="Non-Rental">Not available for Rentals</option>
                  <option value="Both">Both</option>
                </select>
            {errors.rental_stat && <p className='error'>{errors.rental_stat}</p>}

            <label className='f-label'>Company Password:</label>
            <Input
                type='password'
                name='password'
                onChange={handleChange}
                onBlur={handleChange}
            />
            {errors.password && <p className='error'>{errors.password}</p>}
            {errors.Error && <p className='error'>{errors.Error}</p>}

            <button className='submitbtn' type='submit' value='submit'>Submit</button>
            
            </div>

      </div>
      </form>
    </>
  )
}

export default OrganisationForm
