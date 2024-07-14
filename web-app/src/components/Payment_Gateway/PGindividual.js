import React from 'react'
import './PG.css'
import { useParams } from 'react-router-dom'
import { useState , useEffect } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom'





const url = process.env.REACT_APP_SERVER;

const PGIndividual = () => {

  const { userId } = useParams();
  const navigate = useNavigate('');
  const [vehicleData, setVehicleData] = useState({});
  useEffect(() => {
    axios.get(`${url}/vehicles/${userId}`) 
      .then((res) => {
        setVehicleData(res.data);
        setPaymentForm(prevForm => ({
          ...prevForm,
          vehicleType: res.data.vehicleType
        }));
      })
      .catch((err) => console.log(err));
  }, [userId]);
  

  const type = vehicleData.vehicleType;
  const price = vehicleData.Price;

  const [paymentForm, setPaymentForm] = useState({
    Customer_Name: '',
    Customer_Contact: '',
    Customer_Address: '',
    Customer_Destination: '',
    vehicleType: type,
    driverId: userId,
    Date: '',
    Distance: '',
    Time: '',
    Days: '',
    Amount: ''
  });

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prevForm => {
      let newForm = { ...prevForm, [name]: name === 'Distance' || name === 'Days' ? Number(value) : value };
      if (name === 'Distance') {
        const total = newForm.Distance * price;
        let additionalCharge = 0;
        if (newForm.Days >= 1) {
          additionalCharge = (newForm.Days - 1) * 3000; 
        }
        newForm.Amount = total + additionalCharge;
      }
      return newForm;
    });
  }

  useEffect(() => {
    setPaymentForm(prevForm => {
      let newForm = { ...prevForm };
      const total = newForm.Distance * price;
      let additionalCharge = 0;
      if (newForm.Days >= 1) {
        additionalCharge = (newForm.Days - 1) * 2500; 
      }
      newForm.Amount = total + additionalCharge;
      return newForm;
    });
  }, [paymentForm.Days, paymentForm.Distance]);
  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!paymentForm.Customer_Name) {
      alert('Please enter your name.');
      return;
    }
    if (!paymentForm.Customer_Contact) {
      alert('Please enter your contact number.');
      return;
    }
    if (!paymentForm.Customer_Address) {
      alert('Please enter your pick up address.');
      return;
    }
    if (!paymentForm.Customer_Destination) {
      alert('Please enter your final destination.');
      return;
    }
    if (!paymentForm.Distance) {
      alert('Please enter the total distance in Km.');
      return;
    }
    if (!paymentForm.Days) {
      alert('Please enter the number of days of travel.');
      return;
    }
    if (!paymentForm.Date) {
      alert('Please enter the pick up date.');
      return;
    }
    if (!paymentForm.Time) {
      alert('Please enter the pick up time.');
      return;
    }
    
      axios.post(`${url}/individual/payment/${userId}`, paymentForm)
        .then(response => {
          alert(`Your booking ID is ${response.data.bookingId}`);
          navigate('/Goride')
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
  }
  
  
  return (
    <>
      <div className='pay-form'>
        <div className='form-element-indi'>
        <p className='p-head'>Instructions</p>
          <div className='points'>
          <ul className='form-points'>
            <li>Fill all the details correctly</li>
            <li>All details should be true, Fault details will not be taken into account</li>
            <li>Bookings can only be cancelled prior to 2 days before the trip by contacting us.</li>
            <li>Booking Id should be kept in note of when cancelling the booked trip</li>
            <li>When entering the number of days (2 DAYS = 1 NIGHT STAY)</li>
            <li>When entering the number of Km it should be the total Km for the whole trip (UP AND DOWN)</li>
            <li>Additional stops can be negotiated with the driver, An additional charge of <span>Rs {price}/=</span> will be charged by the driver per Km travelled additionally</li>
            <li>Contact Information of the Driver will be revealed 2 days prior to the trip and you will be notified through a text message to your given contact number</li>
            <li>For any inquiry call us <span>#</span></li>
          </ul>
          </div>  
        <p className='p-head'>Customer Details</p>
      <Form>
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label>Your Name</Form.Label>
          <Form.Control 
            type="text"  
            name='Customer_Name'
            onChange={handleCustomerChange} 
            placeholder="Enter Name" 
          />
        </Form.Group>
        </Row>  
      <Row>
        <Form.Group as={Col}>
          <Form.Label>Contact Number</Form.Label>
          <Form.Control 
            type="text" 
            name='Customer_Contact'
            onChange={handleCustomerChange}
            placeholder="Contact" 
          />
        </Form.Group>
        </Row>  
        <Row>
        <Form.Group as={Col}>
          <Form.Label>Final Destination</Form.Label>
          <Form.Control 
            type="text" 
            name='Customer_Destination'
            onChange={handleCustomerChange}
            placeholder="E.g: Nuwara Eliya Botanical Gardens" 
          />
        </Form.Group>

      </Row>

      <Form.Group className="mb-3">
        
      </Form.Group>

      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label>Total Distance in Km(UP and DOWN)</Form.Label>
          <Form.Control 
            type="text" 
            name='Distance'
            onChange={handleCustomerChange}
            placeholder="200km" />
        </Form.Group>  
        </Row>  
        <Row>
        <Form.Group as={Col}>
          <Form.Label>Number of Days of Travel</Form.Label>
          <Form.Control 
            type="number" 
            name='Days'
            onChange={handleCustomerChange}
            placeholder="Enter the number of days" />
        </Form.Group>
      </Row>

      <Form.Group as={Col}>
        <Form.Label>Pick Up Address</Form.Label>
        <Form.Control 
          type='text' 
          name='Customer_Address'
          onChange={handleCustomerChange}
          placeholder="1234 Main St" 
        />
        </Form.Group>

      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label>Pick Up Date</Form.Label>
          <Form.Control 
            type="date" 
            name='Date'
            onChange={handleCustomerChange}
            placeholder="Enter Date" />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Pick Up Time</Form.Label>
          <Form.Control 
            type="time" 
            name='Time'
            onChange={handleCustomerChange}
            placeholder="12:45" />
        </Form.Group>
      </Row>

      <Row className="mb-3">
          <Form.Label>Amount: <span>{paymentForm.Amount}</span></Form.Label>
          
      </Row>

      <Button variant="primary" onClick={handleSubmit} disabled={!Object.values(paymentForm).every(Boolean)}>
        Confirm
      </Button>

      </Form>
        </div>
      </div>
    </>
  )
}

export default PGIndividual
