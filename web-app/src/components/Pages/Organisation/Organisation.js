import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom'
import './Organisation.css'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import gsap from "gsap"
import { useGSAP } from '@gsap/react'
import { Modal } from 'react-bootstrap';
import PGCompany from '../../Payment_Gateway/PGCompany';



const url = process.env.REACT_APP_SERVER;

const Organisation = () => {

    const { companyId } = useParams(); 
    const [selectedVehicleImages, setSelectedVehicleImages] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const [driverData, setDriverData] = useState([]);
    const [vehicleData, setVehicleData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

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

      function handleViewImagesClick(images) {
        setSelectedVehicleImages(images);
        setVehicleSlider(true);
    }

    useGSAP(() => {
        gsap.from('#orgcont', {opacity: 0, duration: 1, delay: 0.2, y:10});
        gsap.from('#orgicont', {opacity: 0, duration: 1, delay: 0.3, y:10});
        gsap.from('.companyimg', {opacity: 0, duration: 1, delay: 0.3, y:10});
      });

  
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

    
   const [vehicleSlider, setVehicleSlider] = useState(false)

    return (
    <> 
      <div>
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

      <div id='orgcont'>
        <div id='orgicont'>
        <p className='comName'>{companyData['companyName']}</p>
            <div className='companyimg'>
            
            <Carousel >
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
                vehicleData.map(vehicle => {
                  return(
                      <Card className='vehiclecard' key={vehicle.VehicleRegNo} border='info'>
                          <Card.Img variant="top" src={`${url}/images/${companyId}/${vehicle.VehicleImage1}`} />
                          <Card.Body>
                              <Card.Title className='ctitle'>{vehicle.VehicleModel}</Card.Title>
                          </Card.Body>
                          <ListGroup className="list-group-flush" style={{fontSize: '.95rem', border: 'none'}}>
                              <ListGroup.Item key={`${vehicle.VehicleRegNo}-VehicleModel`} className=' bgcolor'><p className='card-top'>Model:</p>{vehicle.VehicleModel}</ListGroup.Item>
                              <ListGroup.Item key={`${vehicle.VehicleRegNo}-VehicleType`} className=' bgcolor'><p className='card-top'>Type:</p>{vehicle.VehicleType}</ListGroup.Item>
                              <ListGroup.Item key={`${vehicle.VehicleRegNo}-maxPassengers`} className=' bgcolor'><p className='card-top'>Max Passengers:</p>{vehicle.maxPassengers}</ListGroup.Item>
                              <ListGroup.Item key={`${vehicle.VehicleRegNo}-Aircondition`} className=' bgcolor'><p className='card-top'>AC / No AC:</p>{vehicle.Aircondition}</ListGroup.Item>
                              <ListGroup.Item key={`${vehicle.VehicleRegNo}-availability`} className=' bgcolor'><p className='card-top'>Availability:</p>{vehicle.availability}</ListGroup.Item>
                              <ListGroup.Item key={`${vehicle.VehicleRegNo}-Price/Km`} className=' bgcolor'><p className='card-top'>Price/Km:</p>{vehicle['Price/Km']}</ListGroup.Item>
                          </ListGroup>
                          <Card.Body>
                            <div className='card-btns'>
                            <Button onClick={() => handleViewImagesClick([vehicle.VehicleImage1, vehicle.VehicleImage2, vehicle.VehicleImage3])} variant="warning">View Images</Button>
                            <Button onClick={() => {setShowModal(true); setSelectedVehicle(vehicle);}}>Book Me</Button>
                            </div>
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
               {companyData['companyAddressLine1']}, {companyData['companyAddressLine2']}
            </p>

            <hr/>

        </div>

      </div>
      </div>
      <Modal show={showModal} onHide={() => {setShowModal(false); setSelectedVehicle(null);}}>
      <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {selectedVehicle && <PGCompany vehicleData={selectedVehicle} />}
      </Modal.Body>
      </Modal>
    </>
  )
}

export default Organisation
