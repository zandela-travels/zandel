import React from 'react'
import './Regform.css'
import { useState} from 'react';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'






const Input = ({ type, name, onChange, onBlur }) => (
  <input type={type} name={name}  onChange={onChange} onBlur={onBlur} />

);


const url = process.env.REACT_APP_SERVER;


const IndividualForm = () => {

    const navigate = useNavigate('');
    const [errors, setErrors] = useState({});
    
    const [form1, setForm1] = useState({
        fullName: '',
        userName: '',
        mobileNumber: '',
        age: '',
        addressLine1: '',
        addressLine2: '',
        licenseNumber: '',
        nationalIdNumber: '',
        vehicleRegistrationNumber: '',
        clossetTown: '',
        vehicleType: '',
        vehicleModel: '',
        languages: '',
        price: '',
        rental_stat: '',
        password: ''
      });

      const [files, setFiles] = useState({
        licenseFrontImage: null,
        licenseBackImage: null,
        nationalIdFrontImage: null,
        nationalIdBackImage: null,
        displayImage: null,
        CRImage: null
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
      
        let newFormState = {
          ...form1,
          [name]: value,
        };

        if (name === 'vehicleType') {
          let price;
          switch (value) {
            case 'CAR(4 seats)':
              price = '70'; 
              break;
            case 'VAN(10 seats - 15 seats)':
              price = '85'; 
              break;
            case 'Bus (seats(25-29))':
              price = '130';
              break;
            case 'Bus (seats(40-54))':
              price = '140';
              break;
            case 'Bus (seats(54-58))':
              price = '150'; 
              break;
            default:
              price = '';
          }
          newFormState = {
            ...newFormState,
            price,
          };
        }

        const formErrors = validateForm(newFormState);
        setErrors(formErrors);
      
        setForm1(newFormState);
      };

      const validateFile = (file) => {
        const fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      
        if (!file) {
          return 'Select a File';
        } else {
          if (!fileTypes.includes(file.type)) {
            return 'Invalid file type. Only jpeg, jpg, and png files are allowed.';
          }
        }
        return null;
      };
      
  
      const handleImageChange = (e) => {
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
      
      const validateForm = () => {
        let formErrors = {};
        // validation logic 
        
        const password_pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*(_|[^\w])).{8,20}$/;
        const phno_pattern = /^[0]{1}[7]{1}[01245678]{1}[0-9]{7}$/;
    
        if(!form1.mobileNumber){
          formErrors.mobileNumber = "Mobile Number is required"
      }else if(!phno_pattern.test(form1.mobileNumber)){
          formErrors.mobileNumber = "Invalid phone number"
      }
    
      if(!form1.fullName){
          formErrors.fullName = "Name is required"
      }
    
      if(!form1.userName){
          formErrors.userName = "User name is required"
      }
    
      if(!form1.age){
          formErrors.age = "Driver Age is required"
      }
    
      if(!form1.addressLine1){
          formErrors.addressLine1 = "Address line 1 is required"
      }
    
      if(!form1.addressLine2){
          formErrors.addressLine2 = "Address line 2 is required"
      }
    
      if(!form1.licenseNumber){
          formErrors.licenseNumber = "Driver license number is required"
      }
    
      if(!form1.nationalIdNumber){
          formErrors.nationalIdNumber = "Id number is required"
      }

      if(!form1.rental_stat){
        formErrors.rental_stat = "Rental status is required"
    }
    
      if(!form1.clossetTown){
          formErrors.clossetTown = "Town is required"
      }
    
      if(!form1.vehicleRegistrationNumber){
          formErrors.vehicleRegistrationNumber = "Registration Number is required"
      }
    
      if(!form1.vehicleType){
          formErrors.vehicleType = "Vehicle type is required"
      }
    
      if(!form1.vehicleModel){
          formErrors.vehicleModel = "Vehicle model is required"
      }
    
      if(!form1.languages){
          formErrors.languages = "Fluent Languages are required"
      }
    
      if(!form1.password){
          formErrors.password = "Password is required as this will be used when logging in"
      }else if (!password_pattern.test(form1.password)){
          formErrors.password = "Password should contain minimum eight and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character:"
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
        Object.keys(form1).forEach((key) => {
          formData.append(key, form1[key]);
        });
      
        // Append the files separately
        Object.keys(files).forEach((key) => {
          if (files[key]) {
            formData.append(key, files[key], files[key].name);
          }
        });
      
        // Submit the form data with axios
        try {
          const response = await axios.post(`${url}/register_individual`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
      
          if(response.data.Status === 'Success') {
            alert(`Driver details submitted successfully. Your Driver ID is ${response.data.Driverid}`);
            setForm1({});
            navigate('/login');
          }
        } catch (err) {
          if (err.response && err.response.data && err.response.data.Error) {
            setErrors(prevErrors => ({
              ...prevErrors,
              Error: err.response.data.Error
            }));
          }
      
          // Log the error for debugging
          console.error('Error submitting form:', err);
        }
      };
      
           
      
  
    return (
    <>
      <form onSubmit={handleSubmit}>
        
        <div id='tabs'>

            <div id='tab'>

                <legend>Driver Details</legend>

                <label className='f-label'>Full Name:</label>
                <Input 
                    type="text" 
                    name="fullName" 
                    onChange={handleChange}
                    onBlur={handleChange}
                />
                {errors.fullName && <p className='error'>{errors.fullName}</p>}
                

                <label className='f-label'>Mobile Number:</label>
                <Input 
                    type="text" 
                    name="mobileNumber" 
                    onChange={handleChange}
                    onBlur={handleChange}
                />
                {errors.mobileNumber && <p className='error'>{errors.mobileNumber}</p>}

                <label className='f-label'>Age:</label>
                <Input 
                    type="number" 
                    name="age" 
                    onChange={handleChange}
                    onBlur={handleChange}
                />
                {errors.age && <p className='error'>{errors.age}</p>}

                <legend>Residential Address:</legend>
                <label className='f-label'>Address Line 1:</label>
                <Input
                    type="text"
                    name="addressLine1"
                    onChange={handleChange}
                    onBlur={handleChange}
                />
                {errors.addressLine1 && <p className='error'>{errors.addressLine1}</p>}

                <label className='f-label'>Address Line 2:</label>
                <Input
                    type="text"
                    name="addressLine2"
                    onChange={handleChange}
                    onBlur={handleChange}
                />
                {errors.addressLine2 && <p className='error'>{errors.addressLine2}</p>}
                

                <label className='f-label'>Driver License number:</label>
                <Input
                    type="text"
                    name="licenseNumber"
                    onChange={handleChange}
                    onBlur={handleChange}
                />
                {errors.licenseNumber && <p className='error'>{errors.licenseNumber}</p>}

                <label className='f-label'>Driver License Front Image:</label>
                <input
                    type='file'
                    name='licenseFrontImage'
                    onChange={handleImageChange}
                    onBlur={handleChange}
                />
                {errors.licenseFrontImage && <p className='error'>{errors.licenseFrontImage}</p>}

                <label className='f-label'>Driver License Back Image:</label>
                <input
                    type='file'
                    name='licenseBackImage'
                    onChange={handleImageChange}
                    onBlur={handleChange}
                />
                {errors.licenseBackImage && <p className='error'>{errors.licenseBackImage}</p>}
                

                <label className='f-label'>National ID Card number:</label>
                <Input
                    type="text"
                    name="nationalIdNumber"
                    onChange={handleChange}
                    onBlur={handleChange}
                />
                {errors.nationalIdNumber && <p className='error'>{errors.nationalIdNumber}</p>}

                <label className='f-label'>ID Card Front Image:</label>
                <input
                    type='file'
                    name='nationalIdFrontImage'
                    onChange={handleImageChange}
                    onBlur={handleChange}
                />
                {errors.nationalIdFrontImage && <p className='error'>{errors.nationalIdFrontImage}</p>}

                <label className='f-label'>ID Card Back Image:</label>
                <input
                    type='file'
                    name='nationalIdBackImage'
                    onChange={handleImageChange}
                    onBlur={handleChange}
                />
                {errors.nationalIdFrontImage && <p className='error'>{errors.nationalIdFrontImage}</p>}

                <label className='f-label'>Driver Display Image:</label>
                <input
                    type='file'
                    name='displayImage'
                    onChange={handleImageChange}
                    onBlur={handleChange}
                />
                {errors.displayImage && <p className='error'>{errors.displayImage}</p>}

                <label className='f-label'>Driver Fluent Languages</label>
                <textarea 
                    rows='auto'
                    cols='1'
                    name='languages'
                    onChange={handleChange}
                    onBlur={handleChange}
                />
                {errors.languages && <p className='error'>{errors.languages}</p>}    
            
            </div>

            <div id='tab'>

                <legend className='f-label'>Vehicle Details</legend>

                <label>Vehicle Type</label>
                <select id="Type-of-vehicle" name="vehicleType"  onChange={handleChange} onBlur={handleChange} >
                  <option value="CAR(4 seats)">CAR(4 seats)</option>
                  <option value="VAN(10 seats - 15 seats)">VAN(10 seats - 15 seats)</option>
                  <optgroup label='BUS'>
                      <option value="Bus (seats(25-29))">1. Bus (seats(25-29))</option>
                      <option value="Bus (seats(40-54))">2. Bus (seats(40-54))</option>
                      <option value="Bus (seats(54-58))">3. Bus (seats(54-58))</option>
                  </optgroup>
                </select>
                {errors.vehicleType && <p className='error'>{errors.vehicleType}</p>}

                <label className='f-label'>Clossest Town:</label>
                <select id='location' name='clossetTown' onChange={handleChange} >
                  <optgroup label='Colombo District'>
                  <option value='Colombo'>Colombo</option>
                  <option value='Dehiwala-Mount-Lavinia'>Dehiwala-Mount-Lavinia</option>
                  <option value='Moratuwa'>Moratuwa</option>
                  <option value='Battaramulla'>Battaramulla</option>
                  <option value='Maharagama'>Maharagama</option>
                  <option value='Kotte'>Kotte</option>
                  <option value='Kotikawatta'>Kotikawatta</option>
                  <option value='Kolonnawa'>Kolonnawa</option>
                  <option value='Keselwatta'>Keselwatta</option>
                  <option value='Homagama'>Homagama</option>
                  <option value='Mulleriyawa'>Mulleriyawa</option>
                  <option value='Avissawella'>Avissawella</option>
                  <option value='Kesbewa'>Kesbewa</option>
                  <option value='Kaduwela'>Kaduwela</option>
                  <option value='Boralesgamuwa'>Boralesgamuwa</option>
                  <option value='Piliyandala'>Piliyandala</option>
                  <option value='Nugegoda'>Nugegoda</option>
                  <option value='Nawala'>Nawala</option>
                  <option value='Padukka'>Padukka</option>
                  <option value='Kottawa'>Kottawa</option>
                  <option value='Pannipitiya'>Pannipitiya</option>
                  <option value='Malabe'>Malabe</option>
                  <option value='Hanwella'>Hanwella</option>
                  <option value='Rajagiriya'>Rajagiriya</option>  
                </optgroup>
          
                <optgroup label='Gampaha District'>
                  <option value='Gampaha'>Gampaha</option>
                  <option value='Negombo'>Negombo</option>
                  <option value='Katunayake'>Katunayake</option>
                  <option value='Hendala'>Hendala</option>
                  <option value='Welisara'>Welisara</option>
                  <option value='Ragama'>Ragama</option>
                  <option value='Kandana'>Kandana</option>
                  <option value='Ja Ela'>Ja Ela</option>
                  <option value='Wattala'>Wattala</option>
                  <option value='Kelaniya'>Kelaniya</option>
                  <option value='Peliyagoda'>Peliyagoda</option>
                  <option value='Minuwangoda'>Minuwangoda</option>
                  <option value='Kadawatha'>Kadawatha</option>
                  <option value='Dompe'>Dompe</option>
                  <option value='Divulapitiya'>Divulapitiya</option>
                  <option value='Nittambuwa'>Nittambuwa</option>
                  <option value='Meerigama'>Meerigama</option>
                  <option value='Kiribathgoda'>Kiribathgoda</option>
                  <option value='Veyangoda'>Veyangoda</option>
                  <option value='Ganemulla'>Ganemulla</option>
                </optgroup>

                <optgroup label='Kandy District'>
                  <option  value='Kandy'>Kandy</option>
                  <option  value='Gampola'>Gampola</option>
                  <option  value='Nawalapitiya'>Nawalapitiya</option>
                  <option  value='Wattegama'>Wattegama</option>
                  <option  value='Harispattuwa'>Harispattuwa</option>
                  <option  value='Kadugannawa'>Kadugannawa</option>
                </optgroup>

                <optgroup label='Kurunegala District'>
                  <option value='Kurunegala'>Kurunegala</option>
                  <option value='Kuliyapitiya'>Kuliyapitiya</option>
                  <option value='Polgahawela'>Polgahawela</option>
                  <option value='Pannala'>Pannala</option>
                </optgroup>

                <optgroup label='Ratnapura District'>
                  <option value='Ratnapura'>Ratnapura</option>
                  <option value='Balangoda'>Balangoda</option>
                  <option value='Eheliyagoda'>Eheliyagoda</option>
                  <option value='Kalawana'>Kalawana</option>
                  <option value='Embilipitiya'>Embilipitiya</option>
                </optgroup>

                <optgroup label='Kalutara District'>
                  <option value='Kalutara'>Kalutara</option>
                  <option value='Beruwala'>Beruwala</option>
                  <option value='Panadura'>Panadura</option>
                  <option value='Horana'>Horana</option>
                  <option value='Matugama'>Matugama</option>
                  <option value='Bandaragama'>Bandaragama</option>
                </optgroup>

                <optgroup label='Puttalam District'>
                  <option value='Puttalam'>Puttalam</option>
                  <option value='Chillaw'>Chillaw</option>
                  <option value='Nattandiya'>Nattandiya</option>
                  <option value='Wennappuwa'>Wennappuwa</option>
                  <option value='Marawila'>Marawila</option>
                  <option value='Dankotuwa'>Dankotuwa</option>
                </optgroup>

                <optgroup label='Kegalle District'>
                  <option value='Kegalle'>Kegalle</option>
                  <option value='Mawanella'>Mawanella</option>
                  <option value='Warakapola'>Warakapola</option>
                </optgroup>

                <optgroup label='Matale District'>
                  <option value='Matale'>Matale</option>
                  <option value='Dambulla'>Dambulla</option>
                  <option value='Sigiriya'>Sigiriya</option>
                </optgroup>

                <optgroup label='Badulla District'>
                  <option value='Badulla'>Badulla</option>
                  <option value='Bandarawela'>Bandarawela</option>
                  <option value='Haputale'>Haputale</option>
                  <option value='Welimada'>Welimada</option>
                  <option value='Mahiyanganaya'>Mahiyanganaya</option>
                </optgroup>

                <optgroup label='Nuwara-Eliya District'>
                  <option value='Nuwara-Eliya'>Nuwara-Eliya</option>
                  <option value='Hatton'>Hatton</option>
                  <option value='Talawakele'>Talawakele</option>
                </optgroup>

                <optgroup label='Galle District'>
                  <option value='Galle'>Galle</option>
                  <option value='Ambalangoda'>Ambalangoda</option>
                  <option value='Benthota'>Benthota</option>
                  <option value='Hikkaduwa'>Hikkaduwa</option>
                  <option value='Elpitiya'>Elpitiya</option>
                  <option value='Koggala'>Koggala</option>
                </optgroup>

                <optgroup label='Matara District'>
                  <option value='Matara'>Matara</option>
                  <option value='Weligama'>Weligama</option>
                </optgroup>

                <optgroup label='Hambanthota District'>
                  <option value='Hambanthota'>Hambanthota</option>
                  <option value='Tangalle'>Tangalle</option>
                </optgroup>

                <optgroup label='Batticaloa District'>
                  <option value='Batticaloa'>Batticaloa</option>
                  <option value='Kattankudy'>Kattankudy</option>
                  <option value='Eravur'>Eravur</option>
                </optgroup>

                <optgroup label='Ampara District'>
                  <option value='Ampara'>Ampara</option>
                  <option value='Kalmunai'>Kalmunai</option>
                </optgroup>

                <optgroup label='Jaffna District'>
                  <option value='Jaffna'>Jaffna</option>
                  <option value='Chavakachcheri'>Chavakachcheri</option>
                  <option value='Valvettinurai'>Valvettinurai</option>
                </optgroup>

                <optgroup label='Anuradhapura District'>
                  <option value='Anuradhapura'>Anuradhapura</option>
                  <option value='Bulnewa'>Bulnewa</option>
                  <option value='Eppawala'>Eppawala</option>
                  <option value='Galnewa'>Galnewa</option>
                  <option value='Ganewalpola'>Ganewalpola</option>
                  <option value='Habarana'>Habarana</option>
                  <option value='Kahatagasdeniya'>Kahatagasdeniya</option>
                  <option value='Kekirawa'>Kekirawa</option>
                  <option value='Medawachchiya'>Medawachchiya</option>
                </optgroup>

                <optgroup label='Polonnaruwa District'>
                  <option value='Polonnaruwa'>Polonnaruwa</option>
                  <option value='Dimbulagala'>Dimbulagala</option>
                  <option value='Elahera'>Elahera</option>
                  <option value='Hingurakgoda'>Hingurakgoda</option>
                  <option value='Lankapura'>Lankapura</option>
                  <option value='Welikanda'>Welikanda</option>
                  <option value='Thamankaduwa'>Thamankaduwa</option>
                  <option value='Medirigiriya'>Medirigiriya</option>
                </optgroup>

                <optgroup label='Monaragala District'>
                  <option value='Monaragala'>Monaragala</option>
                  <option value='Bibile'>Bibile</option>
                  <option value='Buttala'>Buttala</option>
                  <option value='Wellawaya'>Wellawaya</option>
                  <option value='Kataragama'>Kataragama</option>
                  <option value='Siyambalanduwa'>Siyambalanduwa</option>
                  <option value='Medagama'>Medagama</option>
                  <option value='Thanamalvila'>Thanamalvila</option>
                  <option value='Badalkubura'>Badalkubura</option>
                  <option value='Sevangala'>Sevangala</option>
                  <option value='Madulla'>Madulla</option>
                </optgroup>

                <optgroup label='Trinomalee District'>
                  <option value='Trincomalee'>Trincomalee</option>
                  <option value='Gomarankadawala'>Gomarankadawala</option>
                  <option value='Kantalai'>Kantalai</option>
                  <option value='Morawewa'>Morawewa</option>
                  <option value='Padavi Siripura'>Padavi Siripura</option>
                  <option value='Seruvila'>Seruvila</option>
                  <option value='Kuchchaveli'>Kuchchaveli</option>
                  <option value='Muttur'>Muttur</option>
                </optgroup>

                <optgroup label='Mannar District'>
                  <option value='Mannar'>Mannar</option>
                  <option value='Madhu'>Madhu</option>
                  <option value='Manthai West'>Manthai West</option>
                  <option value='Musalai'>Musalai</option>
                  <option value='Nanaddan'>Nanaddan</option>
                </optgroup>

                <optgroup label='Vavuniya District'>
                  <option value='Vavuniya'>Vavuniya</option>
                  <option value='Vavuniya North'>Vavuniya North</option>
                  <option value='Vavuniya South'>Vavuniya South</option>
                  <option value='Venkalacheddikulam'>Venkalacheddikulam</option>
                </optgroup>

                <optgroup label='Kilinochchi District'>
                  <option value='Kilinochchi'>Kilinochchi</option>
                  <option value='Kanagapuram'>Kanagapuram</option>
                  <option value='Pallai'>Pallai</option>
                  <option value='Paranthan'>Paranthan</option>
                  <option value='Poonakary'>Poonakary</option>
                  <option value='Tharamapuram'>Tharamapuram</option>
                  <option value='Thiruvaiyaru'>Thiruvaiyaru</option>
                  <option value='Umayaalpuram'>Umayaalpuram</option>
                </optgroup>

                <optgroup label='Mulative District'>
                  <option value='Mulative'>Mulative</option>
                  <option value='Iranaipalai'>Iranaipalai</option>
                  <option value='Kalvilan'>Kalvilan</option>
                  <option value='Kokkilai'>Kokkilai</option>
                  <option value='Kokkuthoduvai'>Kokkuthoduvai</option>
                  <option value='Maanakulam'>Maanakulam</option>
                  <option value='Mallavi'>Mallavi</option>
                  <option value='Mulliyawalai'>Mulliyawalai</option>
                  <option value='Oddusuddan'>Oddusuddan</option>
                  <option value='Puthukkudiyiruppu'>Puthukkudiyiruppu</option>
                  <option value='Thunukkai'>Thunukkai</option>
                </optgroup>
                </select>

                {errors.clossetTown && <p className='error'>{errors.clossetTown}</p>}                

                <label className='f-label'>Vehicle Registration No:</label>
                <Input 
                    type='text'
                    name='vehicleRegistrationNumber'
                    onChange={handleChange}
                    onBlur={handleChange}
                />
                {errors.vehicleRegistrationNumber && <p className='error'>{errors.vehicleRegistrationNumber}</p>}

                <label className='f-label'>Vehicle Model:</label>
                <Input 
                    type='text'
                    name='vehicleModel'
                    onChange={handleChange}
                    onBlur={handleChange}
                />
                {errors.vehicleModel && <p className='error'>{errors.vehicleModel}</p>} 

                <label className='f-label'>Certificate Of Registration Image:</label>
                <input
                    type='file'
                    name='CRImage'
                    onChange={handleImageChange}
                    onBlur={handleChange}
                />
                {errors.CRImage && <p className='error'>{errors.CRImage}</p>}

                <label>Do you Rent Your Vehicle ?</label>
                <select id="Type-of-vehicle" name="rental_stat"  onChange={handleChange} onBlur={handleChange} >
                  <option value="Rental">Available for Rentals</option>
                  <option value="Non-Rental">Not available for Rentals</option>
                  <option value="Both">Both</option>
                </select>
                {errors.rental_stat && <p className='error'>{errors.rental_stat}</p>}

            </div>

            <div id='tab'>

                <legend>Set a Username and a Password for your account</legend>

                <label className='f-label'>User Name:</label>
                <Input 
                    type="text" 
                    name="userName" 
                    onChange={handleChange}
                    onBlur={handleChange}
                />
                {errors.userName && <p className='error'>{errors.userName}</p>}

                <label className='f-label'>Password:</label>
                <Input 
                    type="password" 
                    name="password" 
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

export default IndividualForm
