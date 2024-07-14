import React from 'react'
import { useParams } from 'react-router-dom';
import { useState , useEffect } from 'react';
import './Aboutvh.css'
import Carousel from 'react-bootstrap/Carousel'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import PGIndividual from '../../Payment_Gateway/PGindividual';








const Aboutvh = () => {
  
  const [driverDetails, setDriverDetails] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const url = process.env.REACT_APP_SERVER;

  const navigate = useNavigate('');
  const { userId } = useParams(); 


  useEffect(() => {
    axios.get(`${url}/vehicles/${userId}`) 
      .then((res) => setVehicleDetails(res.data))
      .catch((err) => console.log(err));
  }, [userId]);

  useEffect(() => {
    axios.get(`${url}/${userId}`) 
      .then((res) => setDriverDetails(res.data))
      .catch((err) => console.log(err));
  }, [userId]);


  
  return (
    <>
      <div id='vhcont'>
      
        <div className='Ddescription'>
          <p id='legend'>Driver Details</p>
          <img id='Dimg' src={`http://localhost:8081/images/DriverNo${driverDetails.id}/${driverDetails.displayImage}`} alt='Driver'></img>
          <div id='Ddetails1'>
             <span>Name:</span><p className='data-p'> {driverDetails.fullName}</p>
             <span>Age:</span><p className='data-p'>  {driverDetails.age}</p>
             <span>Fluent Languages:</span><p className='data-p'>  {driverDetails.languages}</p>
          </div>
          <Button onClick={() => setShowModal(true)}>Book Me</Button>
        </div>
         <div className='vhdescription'>
          <p id='legend'>Vehicle Details</p>
          <div className='vhimage'>
          <Carousel className='vhimage1'>
                    
                          <Carousel.Item>
                          <img
                            src={`http://localhost:8081/images/${vehicleDetails.driverId}/${vehicleDetails.vimage1}`} alt='Vehicle Image1'
                          />
                          </Carousel.Item>

                          <Carousel.Item>
                          <img
                            src={`http://localhost:8081/images/${vehicleDetails.driverId}/${vehicleDetails.vimage2}`} alt='Vehicle Image2'
                          />
                          </Carousel.Item>

                          <Carousel.Item>
                          <img
                            src={`http://localhost:8081/images/${vehicleDetails.driverId}/${vehicleDetails.vimage3}`} alt='Vehicle Image3'
                          />
                          </Carousel.Item>

                          <Carousel.Item>
                          <img
                            src={`http://localhost:8081/images/${vehicleDetails.driverId}/${vehicleDetails.vimage4}`} alt='Vehicle Image4'
                          />
                          </Carousel.Item>
        
                  </Carousel>
          </div>
          <p id='vhdetailz'>{vehicleDetails.description}</p>
          <div id='vhdetails1'>
          <div className='inline-data'>
          <span>Model:</span><p className='data-p'> {vehicleDetails.model}</p>
          <span>Type:</span><p className='data-p'> {vehicleDetails.vehicleType}</p>   
          <span>Max passengers:</span><p className='data-p'> {vehicleDetails.maxPassengers}</p>
          </div>
          <div className='inline-data'>
          <span>AC/NO AC:</span><p className='data-p'> {vehicleDetails.aircondition}</p>
          <span>Availability:</span><p className='data-p'> {vehicleDetails.availability}</p>
          <span>Location:</span><p className='data-p'> {vehicleDetails.clossestTown}</p>
          </div>
         </div>
         </div>

         
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PGIndividual userId={userId} />
        </Modal.Body>
      </Modal>

    </>
  )
} 


export default Aboutvh
