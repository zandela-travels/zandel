import React from 'react'
import './UI.css'
import { useParams } from 'react-router-dom'
import lgo from '../Images/sidelogo.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Carousel from 'react-bootstrap/Carousel';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';




const url = process.env.REACT_APP_SERVER;

const CompanyInt = () => {
  

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoautoplay: true,
    autoplaySpeed: 300,
    responsive: [
      {
          breakpoint: 600,
          settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true
          }
      },
      {
          breakpoint: 450,
          settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true
          }
      }
  ]
   }

  const [sideToggle, setSideToggle] = useState(false);
  const [selectedVehicleImages, setSelectedVehicleImages] = useState([]);
  const [vehicleSlider, setVehicleSlider] = useState(false) 
  const [tabs, setTabs] = useState(1);
  const [popup, setPopup] = useState(0);
  const { companyId } = useParams(); 
  const navigate = useNavigate('');
  const [companyData, setCompanyData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [companyBookData, setCompanyBookData] = useState([]);
  const [auth, setAuth] = useState(false); 
  const [message, setMessage] = useState('');
  const [Ireject, setIreject] = useState({});
  const [companyDetails, setCompanyDetails] = useState({
    cimage1: null,
    cimage2: null,
    cimage3: null,
    cimage4: null,
    description: '',
    companyPhno1: '',
    companyPhno2: '',
    addressLine1: '',
    addressLine2: '' 
  });

  const [CompanyCount, setCompanyCount] = useState(0);
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get(`${url}/Iauth`)
    .then(res => {
      if (res.data.Status === "Success") {
        setAuth(true);
        navigate(`/organisation/CompanyNo${res.data.payload}`);
      }else{
        setAuth(false);
        setMessage(res.data.Error);
      }
      })
      .then(err => {
        console.log(err);
      })  

  }, []);

  const updateAndDisplayIndividualAccessCount = async (companyId, setCount) => {
    try {
      const response = await axios.get(`${url}/company_access_count/${companyId}`);
      setCount(response.data.accessCount);
    } catch (error) {
      console.error('There was an error fetching the Company access count!', error);
    }
  };
  
  useEffect(() => {
    updateAndDisplayIndividualAccessCount(companyId, setCompanyCount)
  }, [companyId]);

  useEffect(() => {
    axios.post(`${url}/company_r/${companyId}`)
      .then(response => {
        const rejectStatus = {};
        setCompanyBookData(response.data)
        response.data.forEach(book => {
          rejectStatus[book.BookingId] = book.Rjct_Accpt;
        });
        setIreject(rejectStatus);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  const handleIndividualRejectToggle = (bookingId) => {
    const currentReject = Ireject[bookingId];
    const companyBooking = companyBookData.find(book => book.BookingId === bookingId);
    const companyId = companyBooking.D_C_Id;
    const Date_of_Pickup = companyBooking.Pick_Date;
    const Sales = companyBooking.Amount;
  
    axios.post(`${url}/company_reject/${companyId}`, {
      Rjct_Accpt: currentReject === 'Accepted' ? 'Rejected' : 'Accepted',
      BookingId: bookingId,
      CompanyId: companyId,
      Date_of_Pickup: Date_of_Pickup,
      Sales: Sales
    })
    .then(response => {
      if (response.status === 200) {
        setIreject(prevState => ({
          ...prevState,
          [bookingId]: response.data.Rjct_Accpt // Only update the state for this bookingId
        }));
      } else {
        console.log('Error updating Reject status');
      }
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  };
  
  useEffect(() => {
    axios.get(`${url}/comp/${companyId}`) 
      .then((res) => setCompanyData(res.data))
      .catch((err) => console.log(err));
  }, [companyId]);
  
  useEffect(() => {
    axios.get(`${url}/details/${companyId}`)
      .then((response) => {
        setDriverData(response.data.drivers);
        setVehicleData(response.data.vehicles);
      })
      .catch((error) => {
        console.error('Error fetching details:', error);
      });
  }, [companyId]);

  const popForm = (index) => {
    setPopup(index);
  }

  function handleViewImagesClick(images) {
    setSelectedVehicleImages(images);
    setVehicleSlider(true);
}

  const handleChange = (e) => {
    setCompanyDetails({
      ...companyDetails,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e) => {
    setCompanyDetails({
      ...companyDetails,
      [e.target.name]: e.target.files[0]
    })
  }

  const toggleTab = (index) => {
    setTabs(index);
  }

  const handleLogOut = () => {

    axios.post(`${url}/log_out`)
    .then(res => {
      navigate('/');
    }).catch(err => console.log(err));

  }

  const totalSales = companyBookData.reduce((total, transactions) => {
    return total + parseFloat(transactions.Amount || 0); 
  }, 0);

  const bookingsCount = companyBookData.length;

  const handleCompanyAlterations = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(companyDetails).forEach((key) => {
      formData.append(key, companyDetails[key]);
    });
  
    axios.put(`${url}/company_edit/`+companyId, formData)
    .then(async (response) => {
      if (response.data.alert === 'Company details updated successfully.') {
        alert('Company details updated successfully')
        setCompanyDetails({});
        e.target.reset(); 
        window.location.reload();
      } else if (response.data.alert === 'Error updating Company details.') {
        alert('Error updating Company details')
      }
      })
      .catch(err => {
        console.log(err);
        alert('An error occurred while updating Company details');
      })  
  }
  
  
  return (
    <>
      <div>
        {
          auth ?
          <div className='cont8'>

      <div className={sideToggle === false? 'side-panel active_side-panel' : 'side-panel'}><button onClick={() => setSideToggle(true)}>{'>'}</button></div>
      <div className={sideToggle === true? 'side-panel active_side-panel' : 'side-panel'}><button onClick={() => setSideToggle(false)}>{'<'}</button></div>
        <div className='sidepanel'>

          <img className='side-logo' src={lgo} alt='logo'></img>
          
          <p className='sideText'>Welcome!</p>
          <p className='username'>{companyData['companyName']}</p>

          <p className={tabs === 1? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(1)}><i className='bx bx-slideshow'></i>Preview</p>
          <p className={tabs === 2? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(2)}><i className='bx bx-face'></i>Company Details</p>
          <p className={tabs === 3? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(3)}><i className='bx bx-user'></i>Edit Details</p>
          <p className={tabs === 4? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(4)}><i className='bx bx-doughnut-chart'></i>Stats</p>

          <button className='alterbtn' onClick={handleLogOut}>Log Out</button>
        
        </div> 

        <div className={sideToggle === true? 'sidepanel1 active_sidepanel1' : 'sidepanel1'}>

          <img className='side-logo' src={lgo} alt='logo'></img>
          
          <p className='sideText'>Welcome!</p>
          <p className='username'>{companyData['companyName']}</p>

          <p className={tabs === 1? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(1)}><i className='bx bx-slideshow'></i>Preview</p>
          <p className={tabs === 2? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(2)}><i className='bx bx-face'></i>Company Details</p>
          <p className={tabs === 3? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(3)}><i className='bx bx-user'></i>Edit Details</p>
          <p className={tabs === 4? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(4)}><i className='bx bx-doughnut-chart'></i>Stats</p>


          <button className='alterbtn' onClick={handleLogOut}>Log Out</button>
        
        </div>

        <div className='entry-control'>

            <div className={tabs === 1? 'ui-tabs active-ui-tabs' : 'ui-tabs'}>

              <h1 className='page-head'>Preview</h1>

              <div className='Preview-tab'>

              <div id='orgicontp'>
              <p className='comName'>{companyData['companyName']}</p>
                
              {
                  vehicleSlider &&
                  <div className='vehicleimageslider'>
                      <button id='vhp' onClick={() => setVehicleSlider(false)}><box-icon name='x-circle' color='black' ></box-icon></button>
                      <Carousel className='vhimg' slide={false}>
                      {
                          selectedVehicleImages.map((image, index) => (
                              <Carousel.Item key={index}>
                                  <img src={`${url}/images/${companyId}/${image}`} alt='Vehicle' />
                              </Carousel.Item>
                          ))
                      }
                      </Carousel>
                  </div>
              }


            
              <div className='companyimg'>
              <Carousel>
                <Carousel.Item>
                <img
                    src={`${url}/images/CompanyNo${companyData.id}/${companyData.companyImage1}`} alt='/'
                />
                </Carousel.Item>

                <Carousel.Item>
                <img
                    src={`${url}/images/CompanyNo${companyData.id}/${companyData.companyImage2}`} alt='/'
                />
                </Carousel.Item>

                <Carousel.Item>
                <img
                    src={`${url}/images/CompanyNo${companyData.id}/${companyData.companyImage3}`} alt='/'
                />
                </Carousel.Item>

                <Carousel.Item>
                <img
                    src={`${url}/images/CompanyNo${companyData.id}/${companyData.companyImage4}`} alt='/'
                />
                </Carousel.Item>
          
            </Carousel>
              </div>

        <hr/>

        <p className='companydes'>" {companyData.description} "</p>  

        <hr/>

        <h2 className='subhead'>Our Drivers</h2>
            <div className='backc'>
                <Slider {...settings}>
                    {driverData.map((driverData) => (
                        <div className='card' key={driverData.DriverIdNumber}>
                            <div className='cardimg'>
                                <img src={`${url}/images/${companyId}/${driverData.DriverDp}`} alt='/'></img>
                            </div>
                            <div className='carddes'>
                                <p className='dname'>{driverData.DriverName}</p>
                            </div>
                        </div>
                    )
                    )}
                </Slider>
            </div>

            <hr/>

            <h2 className='subhead'>Our Vehicles</h2>

            <div className='cardcontent'>

            {
                vehicleData.map(vehicleData => {
                  return(
                      <Card className='vehiclecard' key={vehicleData.VehicleRegNo} border='info'>
                          <Card.Img variant="top" src={`${url}/images/${companyId}/${vehicleData.VehicleImage1}`} />
                          <Card.Body>
                              <Card.Title className='ctitle'>{vehicleData.VehicleModel}</Card.Title>
                          </Card.Body>
                          <ListGroup className="list-group-flush" style={{fontSize: '.95rem', border: 'none'}}>
                              <ListGroup.Item key={`${vehicleData.VehicleRegNo}-VehicleModel`} className=' bgcolor'><p className='card-top'>Model:</p>{vehicleData.VehicleModel}</ListGroup.Item>
                              <ListGroup.Item key={`${vehicleData.VehicleRegNo}-VehicleType`} className=' bgcolor'><p className='card-top'>Type:</p>{vehicleData.VehicleType}</ListGroup.Item>
                              <ListGroup.Item key={`${vehicleData.VehicleRegNo}-maxPassengers`} className=' bgcolor'><p className='card-top'>Max Passengers:</p>{vehicleData.maxPassengers}</ListGroup.Item>
                              <ListGroup.Item key={`${vehicleData.VehicleRegNo}-Aircondition`} className=' bgcolor'><p className='card-top'>AC / No AC:</p>{vehicleData.Aircondition}</ListGroup.Item>
                              <ListGroup.Item key={`${vehicleData.VehicleRegNo}-availability`} className=' bgcolor'><p className='card-top'>Availability:</p>{vehicleData.availability}</ListGroup.Item>
                              <ListGroup.Item key={`${vehicleData.VehicleRegNo}-Price/Km`} className=' bgcolor'><p className='card-top'>Price/Km:</p>{vehicleData['Price/Km']}</ListGroup.Item>
                          </ListGroup>
                          <Card.Body>
                          <Button onClick={() => handleViewImagesClick([vehicleData.VehicleImage1, vehicleData.VehicleImage2, vehicleData.VehicleImage3])} variant="warning">View Images</Button>

                          </Card.Body>
                      </Card>
                  )
              })
              
              
            }

            </div>
            
            <hr/>

            <h2 className='subhead'>Contact Us</h2>

            <p className='companydes'>
                "So we hope you have a great selection from our listed drivers and our vehicles and we hope you have
                 a good selection and please be kind enough to go through our vehicle details thoroughly because any
                 changes after your selection cannot be processed after the arrival of the vehicle to your premises.
                 So after you have selected what you want you can call us directly or visit us on our address given 
                 for further clarifications."
            </p>

            <p className='sp'>
                Call Us!
            </p>

            <p className='contactcomp'>
                {companyData.companyPhno1}
                <br/>
                {companyData.companyPhno2}
            </p>

            <p className='sp'>Email Us!</p>
            <p className='contactcomp'>
            {companyData.companyEmail}
            </p>

            <p className='sp'>
                Visit Us!
            </p>

            <p className='contactcomp'>
               {companyData['company Address Line1']}, {companyData['company Address Line2']}
            </p>

            <hr/>

        </div>

              </div>
              

            </div>

            <div className={tabs === 2? 'ui-tabs active-ui-tabs' : 'ui-tabs'}>

              <h1 className='page-head'>Company Details</h1>

              <p className='page-des'>Below shows your drivers and vehicles within your company, Feel free to Edit, View and Add respective records as you need!</p>
              
              <div className='CompanyCrud'>
              <Button variant="success" size="sm" onClick={() => popForm(1)}>Add a Driver</Button>{' '}
              <Button variant="warning" size="sm" onClick={() => popForm(3)}>Edit</Button>{' '}
              <Table  hover variant="dark" responsive>
                <thead>
                  <tr>
                    <th className='thead'>Driver Name</th>
                    <th className='thead'>Driver Id Number</th>
                    <th className='thead'>Driver Availability</th>
                  </tr>
                </thead>
                <tbody>
                {driverData.map((driverData) => (
                    <tr key={driverData.DriverIdNumber}>
                      <td>{driverData.DriverName}</td>
                      <td>{driverData.DriverIdNumber}</td>
                      <td>{driverData.availability}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              </div>


              <div className='CompanyCrud'>
              <Button variant="success" size="sm" onClick={() => popForm(2)}>Add a Vehicle</Button>{' '}
              <Button variant="warning" size="sm" onClick={() => popForm(4)}>Edit</Button>{' '}
              <Table hover variant="dark" responsive>
                <thead>
                  <tr>
                    <th className='thead'>Vehicle Reg No</th>
                    <th className='thead'>Vehicle Type</th>
                    <th className='thead'>Availability</th>
                  </tr>
                </thead>
                <tbody>
                {vehicleData.map((vehicleData) => (
                  <tr key={vehicleData.VehicleRegNo}>
                    <td>{vehicleData.VehicleRegNo}</td>
                    <td>{vehicleData.VehicleType}</td>
                    <td>{vehicleData.availability}</td>
                  </tr>
                ))}
                </tbody>
              </Table>

              </div>

            </div>

            <div className={tabs === 3? 'ui-tabs active-ui-tabs' : 'ui-tabs'}>

              <h1 className='page-head'>Edit Details</h1>
              <div className='profile-tab'>
              <form className='fillup' onSubmit={handleCompanyAlterations}>
                <div id='tab'>
                  <legend>
                    Edit you Company Details From Here!
                  </legend>

                  <label>Company Images</label>

                  <p className='labelp'>Company Image 1</p>
                  <input
                    type='file'
                    name='cimage1'
                    onChange={handleImageChange}
                  />

                  <p className='labelp'>Company Image 2</p>
                  <input
                    type='file'
                    name='cimage2'
                    onChange={handleImageChange}
                  />  

                  <p className='labelp'>Company Image 3</p>
                  <input
                    type='file'
                    name='cimage3'
                    onChange={handleImageChange}
                  />

                  <p className='labelp'>Company Image 4</p>
                  <input
                    type='file'
                    name='cimage4'
                    onChange={handleImageChange}
                  />

                  <label>Company Description</label>
                  <textarea
                    rows='auto'
                    cols='1'
                    name='description'
                    onChange={handleChange}
                   />

                   <label>Company contact number 1</label>  
                   <input
                    type='text'
                    name='companyPhno1'
                    onChange={handleChange}
                   />

                  <label>Company contact number 2</label>  
                   <input
                    type='text'
                    name='companyPhno2'
                    onChange={handleChange}
                   />

                  <label>Company Address line 1</label>  
                   <input
                    type='text'
                    name='addressLine1'
                    onChange={handleChange}
                   />

                    <label>Company Address line 2</label>  
                   <input
                    type='text'
                    name='addressLine2'
                    onChange={handleChange}
                   />

                    <button className='editbutton' value='submit'>Edit</button>

                </div>
              </form>
              </div>

            </div>

            <div className={tabs === 4? 'ui-tabs active-ui-tabs' : 'ui-tabs'}>

              <div className='stats-page'>
              <h1 className='page-head'>Stats</h1>
              <p className='page-des'>Below shows your stats for every single click and every single sale u get. And you can confirm your payment at the end of the page</p>
                <div className='stat-cards'>
                  <div className='s-card'>
                    <p className='c-head'>Visited <i className='bx bx-user-plus'></i></p>
                    <p className='c-value'>{CompanyCount} Persons</p>
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
                    <th className='thead'>Booking ID</th>
                    <th className='thead'>Booking Date</th>
                    <th className='thead'>Customer Name</th>
                    <th className='thead'>Customer Ph</th>
                    <th className='thead'>Customer Address</th>
                    <th className='thead'>Pickup Date</th>
                    <th className='thead'>Pickup Time</th>
                    <th className='thead'>Days</th>
                    <th className='thead'>Amount</th>
                    <th className='thead'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {companyBookData.map((companyBookData) => {
                    const date = new Date(companyBookData.Booking_Date);
                    const formattedDate = date.toLocaleDateString(); 
                    const formattedTime = date.toLocaleTimeString(); 
                    return(
                    <tr key={companyBookData.BookingId}>
                      <td>{companyBookData.BookingId}</td>
                      <td>{`${formattedDate} ${formattedTime}`}</td>
                      <td>{companyBookData.Customer_Name}</td>
                      <td>{companyBookData.Customer_Ph}</td>
                      <td>{companyBookData.Customer_Address}</td>
                      <td>{companyBookData.Pick_Date}</td>
                      <td>{companyBookData.Pick_Time}</td>
                      <td>{companyBookData.Days}</td>
                      <td>{companyBookData.Amount}</td>
                      <td>
                      <Button variant={Ireject[companyBookData.BookingId] !== undefined ? (Ireject[companyBookData.BookingId] === 'Accepted' ? 'danger' : 'success') : 'success'} size="sm" onClick={() => handleIndividualRejectToggle(companyBookData.BookingId)}> {Ireject[companyBookData.BookingId] !== undefined ? (Ireject[companyBookData.BookingId] === 'Accepted' ? 'Reject' : 'Accept') : 'Loading...'}</Button>
                      </td>
                    </tr>
                    )})}
                </tbody>
              </Table>
                </div>
                <p className='page-des'>You should deposit the SUBSCRIPTION AMOUNT within the next 10 days of the next month to the below given account number, And also remember that
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
          <p>Go back to <Link to='/'>Home</Link></p>
        </div>
        }
        <div className={popup === 1? 'popup' : 'close-popup'}>
         <div className='xbtn'> <box-icon color='gold' name='x-circle' onClick={() => popForm(0)}></box-icon>
         </div>
          <AddDriverForm/>
        </div>
        <div className={popup === 2? 'popup' : 'close-popup'}>
         <div className='xbtn'> <box-icon color='gold' name='x-circle' onClick={() => popForm(0)}></box-icon>
         </div>
          <AddVehicleForm/>
        </div>
        <div className={popup === 3? 'popup' : 'close-popup'}>
         <div className='xbtn'> <box-icon color='gold' name='x-circle' onClick={() => popForm(0)}></box-icon>
         </div>
          <EditDriver/>
        </div>
        <div className={popup === 4? 'popup' : 'close-popup'}>
         <div className='xbtn'> <box-icon color='gold' name='x-circle' onClick={() => popForm(0)}></box-icon>
         </div>
          <EditVehicle/>
        </div>
      </div>
    </>
  )
}

export default CompanyInt

const AddDriverForm = () => {

  const { companyId } = useParams(); 
  const [compDriver, setCompDriver] = useState({
    Name: '',
    IDnumber: '',
    Age: '',
    Language: '',
    updatedDriverDetails: null,
    DriverDp: null
  });

  const [errors, setErrors] = useState({
    updatedDriverDetails: '',
    DriverDp: '',
  })

  const handleDriverChange = (e) => {
    setCompDriver({
      ...compDriver,
      [e.target.name]: e.target.value,
    })
  }

  const handleDriverDetails = (e) => {
    const file = e.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const validDocTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];

    if (e.target.name === 'DriverDp' && !validImageTypes.includes(file.type)) {
      setErrors({
        ...errors,
        [e.target.name]: 'Invalid file type. Only jpg, jpeg, and png files are allowed for Driver Display Image.',
      });
      return;
    }

    if (e.target.name === 'updatedDriverDetails' && !validDocTypes.includes(file.type)) {
      setErrors({
        ...errors,
        [e.target.name]: 'Invalid file type. Only doc, docx, and pdf files are allowed for Updated Driver Details.',
      });
      return;
    }

    // Clear error state for the input field
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
    
    setCompDriver({
      ...compDriver,
      [e.target.name]:  e.target.files[0],
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(compDriver).forEach((key) => {
      formData.append(key, compDriver[key]);
    });
  
    axios.post(`${url}/add_driver/${companyId}`, formData)
      .then(async (response) => {
        if (response.data.alert) {
          alert(response.data.alert);
          window.location.reload();
        }
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.alert) {
          // Handle specific file-related errors
          if (err.response.data.Error) {
            alert(err.response.data.Error);
          } else if (err.response.data.alert === 'updatedDriverDetails is required') {
            alert('Driver details file is required');
          } else if (err.response.data.alert === 'DriverDp is required') {
            alert('Driver DP file is required');
          } else {
            alert(err.response.data.alert);
          }
        } else {
          console.log(err);
          alert('An unknown error occurred');
        }
      }) 
  }
  
  

  


  return(
    <>
  <div className='fillup'>
    <div id='addForm'>
    <legend>Add a driver</legend>

    <label>Driver Name</label>
    <input 
     type='text'
     name='Name'
     onChange={handleDriverChange}
     required
    />

    <label>Driver Id Number</label>
    <input 
      type='text'
      name='IDnumber'
      onChange={handleDriverChange}
      required
    />

    <label>Age</label>
    <input
      type='text'
      name='Age'
      onChange={handleDriverChange}
      required
    />

    <label>Languages</label>
    <textarea 
      rows="auto"
      cols="1"
      name='Language'
      onChange={handleDriverChange}
      required
    />

    <label>Driver Display Image</label>
    <input 
      type='file'
      name='DriverDp'
      onChange={handleDriverDetails}
      required
    />  
    {errors.DriverDp && <p className="error">{errors.DriverDp}</p>}

    <label>Updated Driver Details</label>
    <input 
      type='file'
      name='updatedDriverDetails' 
      onChange={handleDriverDetails}
      required
    />  
    {errors.updatedDriverDetails && <p className="error">{errors.updatedDriverDetails}</p>}

    <Button variant='primary' size='sm' onClick={handleSubmit}>Submit</Button>
  </div>
  </div>
  </>
  )
}

const AddVehicleForm = () => {

  const { companyId } = useParams(); 
  const [compVehicle, setCompVehicle] = useState({
    RegNo: '',
    vimage1: null,
    vimage2: null,
    vimage3: null,
    vimage4: null,
    model: '',
    vehicleType: '',
    maxPassengers: '',
    aircondition: '',
    price: '',
    updatedVehicleDetails:  null,
  });

  const [errors, setErrors] = useState({
    vimage1: '',
    vimage2: '',
    vimage3: '',
    vimage4: '',
    updatedVehicleDetails: '',
  });

  const handleVehicleChange = (e) => {
    setCompVehicle({
      ...compVehicle,
      [e.target.name]: e.target.value,
    })
  }

  const handleVehicleDetails = (e) => {
    const file = e.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const validDocTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];

    if (['vimage1', 'vimage2', 'vimage3', 'vimage4'].includes(e.target.name) && !validImageTypes.includes(file.type)) {
      setErrors({
        ...errors,
        [e.target.name]: 'Invalid file type. Only jpg, jpeg, and png files are allowed for Vehicle Images.',
      });
      return;
    }

    if (e.target.name === 'updatedVehicleDetails' && !validDocTypes.includes(file.type)) {
      setErrors({
        ...errors,
        [e.target.name]: 'Invalid file type. Only doc, docx, and pdf files are allowed for Updated Vehicle Details.',
      });
      return;
    }

    // Clear error state for the input field
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
    
    setCompVehicle({
      ...compVehicle,
      [e.target.name]:  e.target.files[0],
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(compVehicle).forEach((key) => {
      formData.append(key, compVehicle[key]);
    });
  
    axios.post(`${url}/add_vehicle/${companyId}`, formData)
      .then(async (response) => {
        if (response.data.alert) {
          alert(response.data.alert);
          window.location.reload();
        }
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.alert) {
          // Handle specific file-related errors
          if (err.response.data.alert === 'vimage1 is required' || 
              err.response.data.alert === 'vimage2 is required' ||
              err.response.data.alert === 'vimage3 is required' ||
              err.response.data.alert === 'vimage4 is required') {
            alert('All vehicle images are required');
          } else if (err.response.data.alert === 'updatedVehicleDetails is required') {
            alert('Updated vehicle details file is required');
          } else {
            alert(err.response.data.alert);
          }
        } else {
          console.log(err);
          alert('An unknown error occurred');
        }
      }) 
  }
  


  return(
    <>
  <div className='fillup'>
    <div id='addForm'>
    <legend>Add a Vehicle</legend>

    <label>Vehicle Registeration Number</label>
    <input 
     type='text'
     name='RegNo'
     onChange={handleVehicleChange}
    />

    <label>Vehicle Model</label>
    <input 
      type='text'
      name='model'
      onChange={handleVehicleChange}
    />

    <label>Vehicle Type</label>
    <select id="Type-of-vehicle" name="vehicleType"  onChange={handleVehicleChange}>
      <option value="CAR(4 seats)">CAR(4 seats)</option>
      <option value="VAN(10 seats - 15 seats)">VAN(10 seats - 15 seats)</option>
      <optgroup label='BUS'>
          <option value="Bus (seats(25-29))">1. Bus (seats(25-29))</option>
          <option value="Bus (seats(40-54))">2. Bus (seats(40-54))</option>
          <option value="Bus (seats(54-58))">3. Bus (seats(54-58))</option>
      </optgroup>
    </select>

    <label>Maximum Passenger capacity</label>
    <input
      type='text'
      name='maxPassengers'
      onChange={handleVehicleChange}
    />

    <label>Price per Km</label>
    <input
      type='number'
      name='price'
      onChange={handleVehicleChange}
    />

    <label>AC / NO AC:</label>
    <select name='aircondition' onChange={handleVehicleChange}>
      <option value = "No AC">No AC</option>
      <option value = "AC">AC</option>
    </select>

    <label>Vehile Images</label>

    <p className='labelp'>Vehicle Image 1</p>

    <input
      type='file'
      name='vimage1'
      onChange={handleVehicleDetails}
    />
     {errors.vimage1 && <p className="error">{errors.vimage1}</p>}

    <p className='labelp'>Vehicle Image 2</p>

    <input
      type='file'
      name='vimage2'
      onChange={handleVehicleDetails}
    />
     {errors.vimage2 && <p className="error">{errors.vimage2}</p>}

    <p className='labelp'>Vehicle Image 3</p>

    <input
      type='file'
      name='vimage3'
      onChange={handleVehicleDetails}
    />
     {errors.vimage3 && <p className="error">{errors.vimage3}</p>}

    <p className='labelp'>Vehicle Image 4</p>

    <input
      type='file'
      name='vimage4'
      onChange={handleVehicleDetails}
    />
     {errors.vimage4 && <p className="error">{errors.vimage4}</p>}

    <label>Updated Vehicle Details</label>
    <input 
      type='file'
      name='updatedVehicleDetails' 
      onChange={handleVehicleDetails}
    />  
     {errors.updatedVehicleDetails && <p className="error">{errors.updatedVehicleDetails}</p>}

    <Button variant='primary' size='sm' onClick={handleSubmit}>Submit</Button>
  </div>
  </div>
  </>
  )
}

const EditDriver = () =>{

  const { companyId } = useParams();
  const [details, setDetails] = useState({
    IDnumber: '',
    availability: ''
  });

  const handleChange = (e) => {
    e.preventDefault();
    setDetails({
      ...details,
      [e.target.name]:  e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  
    axios.put(`${url}/edit_driver/${companyId}`, details)
      .then((response) => {
        if (response.data.alert) {
          alert(response.data.alert);
          window.location.reload()
        }
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.alert) {
          alert(error.response.data.alert);
        } else {
          console.error('Error:', error);
          alert('An unknown error occurred');
        }
      });
  };
  
  

  return(
    <>
    <div className='fillup'>
      <div id='addForm'>
        <label>
          Enter Your Driver Id number
        </label>
        <input
          type='text'
          name='IDnumber'
          onChange={handleChange}
         /> 
        
        <label>
          Edit Availability of the Driver
        </label>
        <select name='availability' onChange={handleChange}>
          <option value='available'>Available</option>
          <option value='notAvailable'>Not Available</option>
        </select>
        <Button variant='primary' size='sm' onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
    </>
  )
}

const EditVehicle = () => {

  const { companyId } = useParams();
  const [editDetails, setEditDetails] = useState({
    VehicleRegNo: '',
    maxPassengers: '',
    availability: '',
    price: '',
    aircondition: ''
  })

  const handleChange = (e) => {
    setEditDetails({
      ...editDetails,
      [e.target.name]: e.target.value,
    })
  }

 
  const handleSubmit = (e) => {
    e.preventDefault();   
  
    axios.put(`${url}/edit_vehicle/${companyId}`, editDetails)
      .then((response) => {
        if (response.data.alert) {
          alert(response.data.alert);
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.alert) {
          alert(error.response.data.alert);
        } else {
          console.error('Error:', error);
          alert('An unknown error occurred');
        }
      });
  };
  
  

  return(
    <>
    <div className='fillup'>
      <div id='addForm'>
        <legend>Edit your vehicle details</legend>

        <label>Enter your vehicle Registration Number</label>
        <input 
          type='text'
          name='VehicleRegNo'
          onChange={handleChange}
         />

        <label>Maximum Passenger Capacity</label>
        <input 
          type='text'
          name='maxPassengers'
          onChange={handleChange}
         />

         <label>Availability</label>
         <select name='availability' onChange={handleChange}>
          <option value='available'>Available</option>
          <option value='notAvailable'>Not Available</option>
        </select> 

        <label>Price per Km</label>
        <input 
          type='number'
          name='price'
          onChange={handleChange}
        />

        <label>AC/No AC</label>  
        <select name='aircondition' onChange={handleChange}>
          <option value = "No AC">No AC</option>
          <option value = "AC">AC</option>
        </select>
        <Button variant='primary' size='sm' onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
    </>
  )
}

const PaymentForm = () => {
  
  const { companyId } = useParams(); 
  
  const [pay, setPay] = useState({
    id: companyId,
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
  
    axios.post(`${url}/sales_account/company/${companyId}`, pay)
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

