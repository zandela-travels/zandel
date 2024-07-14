import React, { useState } from 'react'
import './UI.css'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import lgo from '../Images/sidelogo.png'
import axios from 'axios'
import Carousel from 'react-bootstrap/Carousel'
import { useNavigate } from 'react-router-dom'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';









const url = process.env.REACT_APP_SERVER;

const DriverInt = () => {
  
  const [sideToggle, setSideToggle] = useState(false);
  const [tabs, setTabs] = useState(1);
  const { userId } = useParams(); 
  const [userDetails, setUserDetails] = useState({});
  const [transaction, setTransaction] = useState([]);
  const [vehicleData, setVehicleData] = useState({});
  const [individualCount, setIndividualCount] = useState(0);
  const [auth, setAuth] = useState(false); 
  const [message, setMessage] = useState('');

  const navigate = useNavigate('');
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get(`${url}/Iauth`)
    .then(res => {
      if (res.data.Status === "Success") {
        setAuth(true);
        navigate(`/individual/DriverNo${res.data.payload}`);
      }else{
        setAuth(false);
        setMessage(res.data.Error);
      }
      })
      .then(err => {
        console.log(err);
      })  

  }, []);

  const updateAndDisplayIndividualAccessCount = async (userId, setCount) => {
    try {
      const response = await axios.get(`${url}/individual_access_count/${userId}`);
      setCount(response.data.accessCount);
    } catch (error) {
      console.error('There was an error fetching the individual access count!', error);
    }
  };
  
  useEffect(() => {
    updateAndDisplayIndividualAccessCount(userId, setIndividualCount);
  }, [userId]);

  useEffect(() => {
    axios.get(`${url}/${userId}`) 
      .then((res) => setUserDetails(res.data))
      .catch((err) => console.log(err));
  }, [userId]);

  useEffect(() => {
    axios.get(`${url}/individual_transaction/${userId}`) 
      .then((res) => {
        setTransaction(res.data.bookings);
      })
      .catch((err) => console.log(err));
  }, [userId]);
  


  const [driverDetails, setDriverDetails] = useState({
    dp: null,
    Name: '',
    Age: '',
    Languages: ''
  })

  const [vehicleDetails, setVehicleDetails] = useState({
    vimage1: null,
    vimage2: null,
    vimage3: null,
    vimage4: null,
    description: '',
    maxPassengers: '',
    aircondition: '',
    availability: '',
    clossetTown: ''
  })
  
  const toggleTab = (index) => {
    setTabs(index);
  }

  const handleImageChange = (e) =>{
    setVehicleDetails({
      ...vehicleDetails,
      [e.target.name]: e.target.files[0],
    })
  }

  const handleDriverImageChange = (e) =>{
    setDriverDetails({
      ...driverDetails,
      [e.target.name]: e.target.files[0],
    })
  }

  const handleDriverChange = (e) =>{
    setDriverDetails({
      ...driverDetails,
      [e.target.name]: e.target.value,
    })
  }

  const handleChange = (e) =>{
    setVehicleDetails({
      ...vehicleDetails,
      [e.target.name]: e.target.value,
    })
  }

  const handleDriverAlterations = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(driverDetails).forEach((key) => {
      formData.append(key, driverDetails[key]);
    });
  
    axios.put(`${url}/driver_details/`+userId, formData)
    .then(async (response) => {
      if (response.data.alert === 'Driver details updated successfully.') {
        alert('Driver details updated successfully')
        setDriverDetails({});
        window.location.reload();
      } else if (response.data.alert === 'Error updating driver details.') {
        alert('Error updating driver details')
      }
      })
      .catch(err => {
        console.log(err);
        alert('An error occurred while updating driver details');
      })  
  }
  
  const totalSales = transaction.reduce((total, transactions) => {
    return total + parseFloat(transactions.Amount || 0); 
  }, 0);
  
  const bookingsCount = transaction.length;

  const handleLogOut = () => {
    
    axios.post(`${url}/log_out`)
    .then(res => {
      navigate('/');
    }).catch(err => console.log(err));

  }

  const handleAlterations = (e) => {
  e.preventDefault();

  const formData = new FormData();
  Object.keys(vehicleDetails).forEach((key) => {
    formData.append(key, vehicleDetails[key]);
  });

  axios.put(`${url}/vehicle_details/`+userId, formData)
  .then(async (response) => {
    if (response.data.alert === 'Vehicle details updated successfully.') {
      alert('Vehicle details updated successfully')
      setVehicleDetails({});
      window.location.reload(); 
    } else if (response.data.alert === 'Error updating vehicle details.') {
      alert('Error updating vehicle details')
    }
    })
    .catch(err => {
      console.log(err);
      alert('An error occurred while updating vehicle details');
    })
  }

  useEffect(() => {
    axios.get(`${url}/vehicles/${userId}`) 
      .then((res) => setVehicleData(res.data))
      .catch((err) => console.log(err));
  }, [userId]);

  
  return (
    <>  
        <div>
        {
          auth ?
          <div className='cont8'>

          <div className={sideToggle === false? 'side-panel active_side-panel' : 'side-panel'}><button onClick={() => setSideToggle(true)}>{'>'}</button></div>
          <div className={sideToggle === true? 'side-panel active_side-panel' : 'side-panel'}><button onClick={() => setSideToggle(false)}>{'<'}</button></div>
          <div className={sideToggle === true? 'sidepanel' : 'sidepanel active_sidepanel'}>
  
            <img className='side-logo' src={lgo} alt='logo'></img>
            
            <p className='sideText'>Welcome!</p>
            <p className='username'>{userDetails.userName}</p>
  
            <p className={tabs === 1? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(1)}><i className='bx bx-slideshow'></i>Preview</p>
            <p className={tabs === 2? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(2)}><i className='bx bx-face'></i>Profile</p>
            <p className={tabs === 3? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(3)}><i className='bx bx-user'></i>User Details</p>
            <p className={tabs === 4? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(4)}><i className='bx bx-car'></i>Vehicle Details</p>
            <p className={tabs === 5? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(5)}><i className='bx bx-doughnut-chart'></i>Stats</p>
  
  
            <button className='alterbtn' onClick={handleLogOut}>Log Out</button>
          
          </div> 
  
          <div className={sideToggle === true? 'sidepanel1 active_sidepanel1' : 'sidepanel1'}>
  
            <img className='side-logo' src={lgo} alt='logo'></img>
            
            <p className='sideText'>Welcome!</p>
            <p className='username'>{userDetails.userName}</p>
  
            <p className={tabs === 1? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(1)}><i className='bx bx-slideshow'></i>Preview</p>
            <p className={tabs === 2? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(2)}><i className='bx bx-face'></i>Profile</p>
            <p className={tabs === 3? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(3)}><i className='bx bx-user'></i>User Details</p>
            <p className={tabs === 4? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(4)}><i className='bx bx-car'></i>Vehicle Details</p>
            <p className={tabs === 5? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(5)}><i className='bx bx-doughnut-chart'></i>Stats</p>
  
  
            <button className='alterbtn' onClick={handleLogOut}>Log Out</button>
          
          </div>
          
          <div className='entry-control'>
  
              <div className={tabs === 1? 'ui-tabs active-ui-tabs' : 'ui-tabs'}>
  
                <h1 className='page-head'>Preview</h1>
  
                <p className='page-des'>Below shows how your details would appear to your customers</p>
  
                <div className='preview-tab'>
  
                <div className='Ddescription'>
                  <p id='legend'>Driver Details</p>
                  <img id='Dimg' src={`${url}/images/DriverNo${userDetails.id}/${userDetails.displayImage}`} alt="DP" />
                  <div id='Ddetails1'>
                    <p><span>Name:</span> {userDetails.userName}</p>
                    <p><span>Age:</span> {userDetails.age}</p>
                    <p><span>Fluent Languages:</span> {userDetails.languages}</p>
                    
                  </div>
                </div>
                
                  <div className='vhdescriptionP'>
                  <p id='legend'>Vehicle Details</p>
                  <div className='vhimage'>
                    <Carousel className='vhimage1'>
                      
                            <Carousel.Item>
                            <img
                              src={`${url}/images/${vehicleData.driverId}/${vehicleData.vimage1}`} alt='Vehicle Image1'
                            />
                            </Carousel.Item>
  
                            <Carousel.Item>
                            <img
                              src={`${url}/images/${vehicleData.driverId}/${vehicleData.vimage2}`} alt='Vehicle Image2'
                            />
                            </Carousel.Item>
  
                            <Carousel.Item>
                            <img
                              src={`${url}/images/${vehicleData.driverId}/${vehicleData.vimage3}`} alt='Vehicle Image3'
                            />
                            </Carousel.Item>
  
                            <Carousel.Item>
                            <img
                              src={`${url}/images/${vehicleData.driverId}/${vehicleData.vimage4}`} alt='Vehicle Image4'
                            />
                            </Carousel.Item>
          
                    </Carousel>
  
                </div>
                <div id='vhdetails1p'>
                    <p id='vhdetailz'>{vehicleData.description}</p>
                    <p><span>Model:</span> {vehicleData.model}</p>
                    <p><span>Type:</span> {vehicleData.vehicleType}</p>   
                    <p><span>Max passengers:</span> {vehicleData.maxPassengers}</p>
                    <p><span>AC/NO AC:</span> {vehicleData.aircondition}</p>
                    <p><span>Availability:</span> {vehicleData.availability}</p>
                    <p><span>Location:</span> {vehicleData.clossetTown}(clossest town)</p>
                   
                </div>
                </div>
  
                </div>
  
              </div>
  
              <div className={tabs === 2? 'ui-tabs active-ui-tabs' : 'ui-tabs'}>
  
                <h1 className='page-head'>Profile</h1>
  
                <p className='page-des'>Edit your front end User appearences from here!</p>
  
                <div className='profile-tab'>
                
                <form className='fillup' onSubmit={handleDriverAlterations}>
  
                  <div id='tab'>
  
                  <legend>Edit you Personal details from Here!</legend>  
  
                  <label>Profile Image:</label>
                  <input 
                    type='file'
                    name='dp'
                    onChange={handleDriverImageChange}
                  />  
                  
                  <label>Name:</label>
                  <input
                    type='text'
                    name='Name'
                    onChange={handleDriverChange}
                  />
  
                  <label>Age:</label>
                  <input
                    type='text'
                    name='Age'
                    onChange={handleDriverChange}
                  />
  
                  <label>Fluent Languages:</label>
                  <textarea
                    rows='auto'
                    cols='1'
                    name='Languages'
                    onChange={handleDriverChange}
                  />
  
                  <button className='editbutton' type='submit' value='submit'>Edit</button>
  
                  </div>
  
                </form>
  
                <form className='fillup' onSubmit={handleAlterations}>
                <div id='tab'>
  
                <legend>Edit your Vehicle Details from here!</legend>
  
                <label>Select Images for Vehicles</label>
                
                <p className='labelp'>Vehicle Image 1</p>
  
                <input
                  type='file'
                  name='vimage1'
                  onChange={handleImageChange}
                />
  
                <p className='labelp'>Vehicle Image 2</p>
  
                <input
                  type='file'
                  name='vimage2'
                  onChange={handleImageChange}
                />
  
                <p className='labelp'>Vehicle Image 3</p>
  
                <input
                  type='file'
                  name='vimage3'
                  onChange={handleImageChange}
                />
  
                <p className='labelp'>Vehicle Image 4</p>
  
                <input
                  type='file'
                  name='vimage4'
                  onChange={handleImageChange}
                />
  
                <label>Description</label>
                <textarea rows = "4" name='description' onChange={handleChange}/>
  
                <label>Model:</label>
                <input
                  type='text'
                  name='model'
                  onChange={handleChange}
                />
  
                <label>Type:</label>
                <select id="Type-of-vehicle" name="vehicleType"  onChange={handleChange}>
                    <option value="CAR(4 seats)">CAR(4 seats)</option>
                    <option value="VAN(10 seats - 15 seats)">VAN(10 seats - 15 seats)</option>
                    <optgroup label='BUS'>
                        <option value="Bus (seats(25-29))">1. Bus (seats(25-29))</option>
                        <option value="Bus (seats(40-54))">2. Bus (seats(40-54))</option>
                        <option value="Bus (seats(54-58))">3. Bus (seats(54-58))</option>
                    </optgroup>
                  </select>
  
                <label>Max Passengers:</label>
                <input
                  type='text'
                  name='maxPassengers'
                  onChange={handleChange}
                />
  
                <label>AC / NO AC:</label>
                <select name='aircondition' onChange={handleChange}>
                  <option value = "No AC">No AC</option>
                  <option value = "AC">AC</option>
                </select>
  
                <label>Availability:</label>
                <select name='availability' onChange={handleChange}>
                  <option value = "weekdays">Only On Week Days</option>
                  <option value = "weekends">Only on Week Ends</option>
                  <option value = "always">Always</option>
                </select>
  
                <label>Clossest Town:</label>
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
  
                <button className='editbutton' type='submit' value='submit'>Edit</button>
  
                </div>
  
                </form>
                </div>
              </div>
              
              <div className={tabs === 3? 'ui-tabs active-ui-tabs' : 'ui-tabs'}>
  
                <h1 className='page-head'>User Details</h1>
  
                <p className='page-des'>Below shows your Personal details that you submitted when you filled the registration form. If there is any issue in any of those information you should immediately contact or whatsapp us @ <span>0781799999</span>!</p>
  
                <table className='user-table'>
                <tbody>
                  <tr className='table-head'>
                    <th>
                      Fields
                    </th>
                    <th>
                      Details
                    </th>
                  </tr>
                  <tr>
                    <td className='user-feilds'>Driver Id</td>
                    <td className='user-records'>{userId}</td>
                  </tr>
                  <tr>
                    <td className='user-feilds'>Full Name</td>
                    <td className='user-records'>{userDetails.fullName}</td>
                  </tr>
                  <tr>
                    <td className='user-feilds'>User Name</td>
                    <td className='user-records'>{userDetails.userName}</td>
                  </tr>
                  <tr>
                    <td className='user-feilds'>Age</td>
                    <td className='user-records'>{userDetails.age}</td>
                  </tr>
                  <tr>
                    <td className='user-feilds'>Contact</td>
                    <td className='user-records'>{userDetails.mobileNumber}</td>
                  </tr>
                  <tr>
                    <td className='user-feilds'>Residential Address</td>
                    <td className='user-records'>{userDetails.addressLine1}, {userDetails.addressLine2}</td>
                  </tr>
                  <tr>
                    <td className='user-feilds'>Driver License Number</td>
                    <td className='user-records'>{userDetails.licenseNumber}</td>
                  </tr>
                  <tr>
                    <td className='user-feilds'>Driver National ID Number</td>
                    <td className='user-records'>{userDetails.nationalIdNumber}</td>
                  </tr>
                  </tbody>
                </table>
  
                <div className='cards'>
                  <div className='image-card'>
  
                    <img src={`${url}/images/DriverNo${userDetails.id}/${userDetails.licenseFrontImage}`} alt='License Front'/>
                    <p className='card-txt'>Driver License Front Image</p>
  
                  </div>
                  <div className='image-card'>
  
                    <img src={`${url}/images/DriverNo${userDetails.id}/${userDetails.licenseBackImage}`} alt='License Back'/>
                    <p className='card-txt'>Driver License Back Image</p>
  
                  </div>
                  <div className='image-card'>
  
                    <img src={`${url}/images/DriverNo${userDetails.id}/${userDetails.nationalIdFrontImage}`} alt='ID Front'/>
                    <p className='card-txt'>Driver ID Card Front Image</p>
  
                  </div>
                  <div className='image-card'>
  
                    <img src={`${url}/images/DriverNo${userDetails.id}/${userDetails.nationalIdBackImage}`} alt='ID Back'/>
                    <p className='card-txt'>Driver ID Card Back Image</p>
  
                  </div>
                </div>
                  
  
              </div>
  
              <div className={tabs === 4? 'ui-tabs active-ui-tabs' : 'ui-tabs'}>
  
                <h1 className='page-head'>Vehicle Details</h1>
  
                <p className='page-des'>Below shows your Vehicle details that you submitted when you filled the registration form. If there is any issue in any of those information you should immediately contact or whatsapp us @ <span>0781799999</span>!</p>
  
                <table className='user-table'>
                <tbody>
                  <tr className='table-head'>
                    <th>
                      Feilds
                    </th>
                    <th>
                      Details
                    </th>
                  </tr>
                  <tr>
                    <td className='user-feilds'>Driver Id</td>
                    <td className='user-records'>{userId}</td>
                  </tr>
                  <tr>
                    <td className='user-feilds'>Vehicle Model</td>
                    <td className='user-records'>{vehicleData.model}</td>
                  </tr>
                  <tr>
                    <td className='user-feilds'>Vehicle Type</td>
                    <td className='user-records'>{vehicleData.vehicleType}</td>
                  </tr>
                  <tr>
                    <td className='user-feilds'>Vehicle Registration Number</td>
                    <td className='user-records'>{vehicleData.vehicleRegNo}</td>
                  </tr>
                  </tbody>
                </table>
  
                <div className='cards'>
                  <div className='image-card'>
  
                    <img src={`${url}/images/DriverNo${userDetails.id}/${userDetails.CertificateOfReg}`} alt='CR'/>
                    <p className='card-txt'>Vehicle CR Image</p>
  
                  </div>
                </div>
                
  
              </div>
  
              <div className={tabs === 5? 'ui-tabs active-ui-tabs' : 'ui-tabs'}>
  
                <div className='stats-page'>
                <h1 className='page-head'>Stats</h1>
                  <div className='stat-cards'>
                  <div className='s-card'>
                      <p className='c-head'>Reach <i className='bx bx-user-plus'></i></p>
                      <p className='c-value'>{individualCount} Reached</p>
                    </div>
                    <div className='s-card'>
                      <p className='c-head'>Booked <i className='bx bx-user-check'></i></p>
                      <p className='c-value'>{bookingsCount} Bookings</p>
                    </div>
                    <div className='s-card'>
                      <p className='c-head'>Sales <i className='bx bx-trending-up'></i></p>
                      <p className='c-value'>Rs {totalSales}</p>
                    </div>
                  </div>
                  <p className='page-des'>Below shows your Transaction history up to date.</p>
                  <div className='stat-table'>
                  <Table  hover variant="dark" responsive>
                  <thead>
                    <tr>
                      <th className='thead'>Transaction Id</th>
                      <th className='thead'>Customer</th>
                      <th className='thead'>Transaction Date</th>
                      <th className='thead'>Sale Made</th>
                    </tr>
                  </thead>
                  <tbody>
                  {transaction.map((transaction) => {
                    const date = new Date(transaction.Booking_Date);
                    const formattedDate = date.toLocaleDateString(); 
                    const formattedTime = date.toLocaleTimeString(); 
  
                    return (
                      <tr key={transaction.BookingId}>
                        <td>{transaction.BookingId}</td>
                        <td>{transaction.Customer_Name}</td>
                        <td>{`${formattedDate} ${formattedTime}`}</td>
                        <td>{transaction.Amount}</td>
                      </tr>
                    );
                  })}
                  </tbody>
                </Table>
                  </div>
                  <p className='page-des'>You should deposit the DUE AMOUNT within the next 10 days of the next month to the below given account number, And also remember that
                  you will not be listed to our customers untill you have paid your amount for the respective month. After the payment, Fill out the given form and
                  after we check your payment you will be listed again in the website.</p>
                  <div className='payment-form'>
                  <div className='bank-details'>
                    <p>Bank Name: People's Bank</p>
                    <p>Bank Branch: Malwana</p>
                    <p>Account Number: 191100160017755</p>
                    <p>Account Name: Adithya Enterprises</p>
                  </div>
                  <PaymentForm/>
                  </div>
  
                </div>
  
              </div>
          </div>
        </div>
        :
        <div className='notauth'>
          <h1>{message}!</h1>
          <p>Go back to <Link to='/Login'>Login</Link></p>
        </div>  
        }
      </div>
    </>
  )
}

export default DriverInt

const PaymentForm = () => {

  const { userId } = useParams(); 
  
  const [pay, setPay] = useState({
    id: userId,
    RefNo: '',
    Amount: '',
    Deposit_date: ''
  })

  const handlePayChange = (e) => {
    e.preventDefault();
    setPay({
      ...pay,
      [e.target.name]: e.target.value,
    })
  }

  const handlePay = (e) => {
    e.preventDefault();
  
    axios.post(`${url}/sales_account/individual/${userId}`, pay)
    .then(response => {
      if (response.status === 200) {
        alert(response.data.alert);
        window.location.reload();
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
      <div className='p-form'>
        <label>Enter Recipt Referance Number:</label>
        <input
            type='text'
            name='RefNo'
            onChange={handlePayChange}
        />

        <label>Amount:</label>
        <input
            type='text'
            name='Amount'
            onChange={handlePayChange}
        />

        <label>Date of deposit:</label>
        <input
            type='date'
            name='Deposit_date'
            onChange={handlePayChange}
        />

        <Button size='sm' variant='primary' onClick={handlePay}>Submit</Button>    
      </div>
    </>
  )
}