import{ React, useState, useEffect }from 'react'
import axios from 'axios'
import lgo from '../../Images/sidelogo.png'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Location from '../../Location/Location'
import { Link } from 'react-router-dom';
import './Admin.css'






const url = process.env.REACT_APP_SERVER;

const Admin = () => {
  
    const [sideToggle, setSideToggle] = useState(false);
    const [tabs, setTabs] = useState(1);
    const navigate = useNavigate('');
    const [companyData, setCompanyData] = useState([]);
    const [companyBookData, setCompanyBookData] = useState([]);
    const [individualData, setIndividualData] = useState([]);
    const [individualBookData, setIndividualBookData] = useState([]);
    const [popup1, setPopup1] = useState(0);
    const [editId, setEditId] = useState(null);
    const [companyEditId, setCompanyEditId] = useState(null);
    const [Ireject, setIreject] = useState({});
    const [Ivisibility, setIvisibility] = useState({});
    const [sales, setSales] = useState([]);
    const [IndividualSales, setIndividualSales] = useState([]);
    const [CompanySales, setCompanySales] = useState([]);
    const [auth, setAuth] = useState(false); 
    const [message, setMessage] = useState('');
    const [Cvisibility, setCvisibility] = useState({});

    const IbookingsCount = individualBookData.length;
    const CbookingsCount =  companyBookData.length;

    const totalSales = sales.reduce((total, transactions) => {
      return total + parseFloat(transactions.Amount || 0); 
    }, 0);

    const IndiSales = IndividualSales.reduce((total, transactions) => {
      return total + parseFloat(transactions.Sales || 0); 
    }, 0);

    const CompSales = CompanySales.reduce((total, transactions) => {
      return total + parseFloat(transactions.Sales || 0); 
    }, 0);

    axios.defaults.withCredentials = true;
    useEffect(() => {
      axios.get(`${url}/Iauth`)
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          navigate('/Admin');
        }else{
          setAuth(false);
          setMessage(res.data.Error);
        }
        })
        .then(err => {
          console.log(err);
        })  
  
    }, []);

    useEffect(() => {
      axios.post(`${url}/admin_sales`)
        .then((response) => {
          setSales(response.data);
        })
        .catch((error) => {
          console.error('Error fetching details:', error);
        });
    }, []);

    useEffect(() => {
      axios.post(`${url}/admin_sales_indi`)
        .then((response) => {
          setIndividualSales(response.data);
        })
        .catch((error) => {
          console.error('Error fetching details:', error);
        });
    }, []);

    useEffect(() => {
      axios.post(`${url}/admin_sales_comp`)
        .then((response) => {
          setCompanySales(response.data);
        })
        .catch((error) => {
          console.error('Error fetching details:', error);
        });
    }, []);

    useEffect(() => {
        axios.post(`${url}/comp_admin_details`)
          .then(response => {
            const visibilityStatus = {};
            setCompanyData(response.data);
            response.data.forEach(user => {
              visibilityStatus[user.id] = user.isVisible;
            });
            setCvisibility(visibilityStatus);
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
      }, []);
    
      useEffect(() => {
        axios.post(`${url}/individual_data`)
          .then(response => {
            setIndividualData(response.data);
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
      }, []);

      useEffect(() => {
        axios.post(`${url}/individual_visibility`)
          .then(response => {
            const visibilityStatus = {};
            response.data.forEach(user => {
              visibilityStatus[user.driverId] = user.isVisible;
            });
            setIvisibility(visibilityStatus);
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
      }, []);

      useEffect(() => {
        axios.post(`${url}/book_individual`)
          .then(response => {
            const rejectStatus = {};
            setIndividualBookData(response.data)
            response.data.forEach(book => {
              rejectStatus[book.BookingId] = book.Rjct_Accpt;
            });
            setIreject(rejectStatus);
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
      }, []);

      useEffect(() => {
        axios.post(`${url}/book_company`)
          .then(response => {
            setCompanyBookData(response.data)
          })
          .catch(error => {
            console.error('There was an error!', error);
          });
      }, []);

      const handleIndividualRejectToggle = (BookingId) => {
        const currentReject = Ireject[BookingId];
        // Find the individual booking data object
        const individualBooking = individualBookData.find(book => book.BookingId === BookingId);
        const DriverId = individualBooking.D_C_Id;
        const Date_of_Pickup = individualBooking.Pick_Date;
        const Sales = individualBooking.Amount;
      
        axios.post(`${url}/individual_book/${BookingId}`, {
          Rjct_Accpt: currentReject === 'Accepted' ? 'Rejected' : 'Accepted',
          DriverId: DriverId,
          Date_of_Pickup: Date_of_Pickup,
          Sales: Sales
        })
        .then(response => {
          if (response.status === 200) {
            setIreject({
              ...Ireject,
              [BookingId]: response.data.Rjct_Accpt,
            });
          } else {
            console.log('Error updating Reject status');
          }
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
      };
      
      
      const handleVisibilityToggle = (driverId) => {
        const currentVisibility = Ivisibility[driverId];
      
        axios.post(`${url}/individual_show/${driverId}`, {
          // Directly use the 'No' and 'Yes' values
          isVisible: currentVisibility === 'Yes' ? 'No' : 'Yes'
        })
        .then(response => {
          if (response.status === 200) {
            setIvisibility({
              ...Ivisibility,
              [driverId]: response.data.isVisible,
            });
          } else {
            console.log('Error updating visibility status');
          }
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
      };

      const handleCompanyVisibilityToggle = (id) => {
        const currentVisibility = Cvisibility[id];
      
        axios.post(`${url}/company_show/${id}`, {
          // Directly use the 'No' and 'Yes' values
          isVisible: currentVisibility === 'Yes' ? 'No' : 'Yes'
        })
        .then(response => {
          if (response.status === 200) {
            setCvisibility({
              ...Cvisibility,
              [id]: response.data.isVisible
            });
          } else {
            console.log('Error updating visibility status');
          }
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
      };
    
      const popForm = (index) => {
        setPopup1(index);
      }  

      const handleEdit = (id) => {
        popForm(1);
        setEditId(id);
      }

      const handleCompEdit = (id) => {
        popForm(4);
        setCompanyEditId(id);
      }

      const [viewData, setViewData] = useState(null);

      const handleView = (id) => {
        const data = individualData.find(data => data.id === id);
        setViewData(data);
        popForm(2);
      }

      const [viewCompanyData, setViewCompanyData] = useState(null);

      const handleCompView = (id) => {
        const data = companyData.find(data => data.id === id);
        setViewCompanyData(data);
        popForm(3);
      }


    const toggleTab = (index) => {
        setTabs(index);
      }
    
      const handleLogOut = (e) => {
        axios.post(`${url}/log_out`)
        .then(res => {
          navigate('/');
        }).catch(err => console.log(err));
      }  
  
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
          <p className='username'></p>

          <p className={tabs === 1? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(1)}><i className='bx bx-user'></i>Individual Details</p>
          <p className={tabs === 2? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(2)}><i className='bx bx-building'></i>Company Details</p>
          <p className={tabs === 3? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(3)}><i className='bx bx-doughnut-chart'></i>Stats</p>


          <button className='alterbtn' onClick={handleLogOut}>Log Out</button>
        
        </div> 

        <div className={sideToggle === true? 'sidepanel1 active_sidepanel1' : 'sidepanel1'}>

          <img className='side-logo' src={lgo} alt='logo'></img>
          
          <p className='sideText'>Welcome!</p>
          <p className='username'></p>

          <p className={tabs === 1? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(1)}><i className='bx bx-user'></i>Individual Details</p>
          <p className={tabs === 2? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(2)}><i className='bx bx-building'></i>Company Details</p>
          <p className={tabs === 3? 'side-tabs active-side-tabs' : 'side-tabs'} onClick={() => toggleTab(3)}><i className='bx bx-doughnut-chart'></i>Stats</p>


          <button className='alterbtn' onClick={handleLogOut}>Log Out</button>
        
        </div>
        <div className='entry-control'>

        <div className={popup1 === 1? 'popup1' : 'close-popup1'}>
         <div className='xbtn'> <box-icon color='gold' name='x-circle' onClick={() => popForm(0)}></box-icon>
         </div>
         {editId && <DriverEdit id={editId} />}
        </div>

        <div className={popup1 === 2? 'popup1' : 'close-popup1'}>
         <div className='xbtn'> <box-icon color='gold' name='x-circle' onClick={() => {popForm(0); setViewData(null);}}></box-icon>
         </div>
         {viewData && <DriverImages id={viewData.id} state={viewData} />}
        </div>

        <div className={popup1 === 3? 'popup1' : 'close-popup1'}>
         <div className='xbtn'> <box-icon color='gold' name='x-circle' onClick={() => {popForm(0); setViewCompanyData(null);}}></box-icon>
         </div>
         {viewCompanyData && <CompanyData id={viewCompanyData.id} state={viewCompanyData} />}
        </div>

        <div className={popup1 === 4? 'popup1' : 'close-popup1'}>
         <div className='xbtn'> <box-icon color='gold' name='x-circle' onClick={() => popForm(0)}></box-icon>
         </div>
         {companyEditId && <CompanyEdit id={companyEditId} />}
        </div>
            
        <div className={tabs === 1? 'ui-tabs active-ui-tabs' : 'ui-tabs'}>
            <p className='page-head'>Individual Details</p>
            <div className='CompanyCrud'>
              <p className='page-des'>Individual Drivers</p>
              <Table  hover variant="dark" responsive>
                <thead>
                  <tr>
                    <th className='thead'>Individual ID</th>
                    <th className='thead'>Individual Reg Date</th>
                    <th className='thead'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {individualData.map((individualData) => {
                  const date = new Date(individualData.Registration_Date);
                  const formattedDate = date.toLocaleDateString(); 
                  const formattedTime = date.toLocaleTimeString();
                  return (
                    <tr key={individualData.id}>
                      <td>DriverNo{individualData.id}</td>
                      <td>{`${formattedDate} ${formattedTime}`}</td>
                      <td>
                      <a className='view' href={`individual/DriverNo${individualData.id}`}><Button variant="primary" size="sm">View Page</Button></a>{' '}
                      <Button variant="info" size="sm" onClick={() => handleView(individualData.id)}>View Details</Button>{' '}
                      <Button variant="light" size="sm" onClick={() => handleEdit(individualData.id)}>Edit</Button>{' '}
                      <Button variant={Ivisibility[`DriverNo${individualData.id}`] !== undefined ? (Ivisibility[`DriverNo${individualData.id}`] === 'Yes' ? 'danger' : 'success') : 'success'} size="sm" onClick={() => handleVisibilityToggle(`DriverNo${individualData.id}`)}> {Ivisibility[`DriverNo${individualData.id}`] !== undefined ? (Ivisibility[`DriverNo${individualData.id}`] === 'Yes' ? 'Hide' : 'Show') : 'Loading...'}</Button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </Table>

              <p className='page-des'>Individual Bookings</p>    
              <Table  hover variant="dark" responsive>
                <thead>
                  <tr>
                    <th className='thead'>Booking ID</th>
                    <th className='thead'>Booking Date</th>
                    <th className='thead'>Individual ID</th>
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
                {individualBookData.map((individualBookData) => {
                    const date = new Date(individualBookData.Booking_Date);
                    const formattedDate = date.toLocaleDateString(); 
                    const formattedTime = date.toLocaleTimeString();
                    return(
                    <tr key={individualBookData.BookingId}>
                      <td>{individualBookData.BookingId}</td>
                      <td>{`${formattedDate} ${formattedTime}`}</td>
                      <td>{individualBookData.D_C_Id}</td>
                      <td>{individualBookData.Customer_Name}</td>
                      <td>{individualBookData.Customer_Ph}</td>
                      <td>{individualBookData.Customer_Address}</td>
                      <td>{individualBookData.Pick_Date}</td>
                      <td>{individualBookData.Pick_Time}</td>
                      <td>{individualBookData.Days}</td>
                      <td>{individualBookData.Amount}</td>
                      <td>
                      <Button variant={Ireject[individualBookData.BookingId] !== undefined ? (Ireject[individualBookData.BookingId] === 'Accepted' ? 'danger' : 'success') : 'success'} size="sm" onClick={() => handleIndividualRejectToggle(individualBookData.BookingId)}> {Ireject[individualBookData.BookingId] !== undefined ? (Ireject[individualBookData.BookingId] === 'Accepted' ? 'Reject' : 'Accept') : 'Loading...'}</Button>
                      </td>
                    </tr>
                )})}
                </tbody>
              </Table>
                
              </div>

        </div>
        <div className={tabs === 2? 'ui-tabs active-ui-tabs' : 'ui-tabs'}>
        <p className='page-head'>Company Details</p>
                  <div className='CompanyCrud'>
                    <p className='page-des'>Company Users</p>
              <Table  hover variant="dark" responsive>
                <thead>
                  <tr>
                    <th className='thead'>Individual ID</th>
                    <th className='thead'>Individual Reg Date</th>
                    <th className='thead'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {companyData.map((companyData) => {
                    const date = new Date(companyData.Registration_Date);
                    const formattedDate = date.toLocaleDateString(); 
                    const formattedTime = date.toLocaleTimeString();
                    return(
                    <tr key={companyData.id}>
                      <td>CompanyNo{companyData.id}</td>
                      <td>{`${formattedDate} ${formattedTime}`}</td>
                      <td>
                      <a className='view' href={`Company/CompanyNo${companyData.id}`}><Button variant="primary" size="sm">View Page</Button></a>{' '}
                      <Button variant="info" size="sm" onClick={() => handleCompView(companyData.id)}>View Details</Button>{' '}
                      <Button variant="light" size="sm" onClick={() => handleCompEdit(companyData.id)}>Edit</Button>{' '}
                      <Button variant={Cvisibility[companyData.id] !== undefined ? (Cvisibility[companyData.id] === 'Yes' ? 'danger' : 'success') : 'success'} size="sm" onClick={() => handleCompanyVisibilityToggle(companyData.id)}> {Cvisibility[companyData.id] !== undefined ? (Cvisibility[companyData.id] === 'Yes' ? 'Hide' : 'Show') : 'Loading...'}</Button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </Table>

              <p className='page-des'>Company Bookings</p>    
              <Table  hover variant="dark" responsive>
                <thead>
                  <tr>
                    <th className='thead'>Booking ID</th>
                    <th className='thead'>Booking Date</th>
                    <th className='thead'>Individual ID</th>
                    <th className='thead'>Customer Name</th>
                    <th className='thead'>Customer Ph</th>
                    <th className='thead'>Customer Address</th>
                    <th className='thead'>Pickup Date</th>
                    <th className='thead'>Pickup Time</th>
                    <th className='thead'>Days</th>
                    <th className='thead'>Amount</th>
                    <th className='thead'>State</th>
                  </tr>
                </thead>
                <tbody>
                {companyBookData.map((companyBookData) => {
                    const date = new Date(companyBookData.Booking_Date);
                    const formattedDate = date.toLocaleDateString(); 
                    const formattedTime = date.toLocaleTimeString();
                    return (
                    <tr key={companyBookData.BookingId}>
                      <td>{companyBookData.BookingId}</td>
                      <td>{`${formattedDate} ${formattedTime}`}</td>
                      <td>{companyBookData.D_C_Id}</td>
                      <td>{companyBookData.Customer_Name}</td>
                      <td>{companyBookData.Customer_Ph}</td>
                      <td>{companyBookData.Customer_Address}</td>
                      <td>{companyBookData.Pick_Date}</td>
                      <td>{companyBookData.Pick_Time}</td>
                      <td>{companyBookData.Days}</td>
                      <td>{companyBookData.Amount}</td>
                      <td>{companyBookData.Rjct_Accpt}</td>
                    </tr>
                  )})}
                </tbody>
              </Table>

              </div>

        </div>
        <div className={tabs === 3? 'ui-tabs active-ui-tabs' : 'ui-tabs'}>
        <p className='page-head'>Stats</p>

        <div className='stat-cards'>
                <div className='s-card'>
                    <p className='c-head'>Bookings (Individual)<i className='bx bx-user-plus'></i></p>
                    <p className='c-value'>{IbookingsCount} Bookings</p>
                  </div>
                  <div className='s-card'>
                    <p className='c-head'>Accepted Sales (Individual) <i className='bx bx-trending-up'></i></p>
                    <p className='c-value'>Rs {IndiSales}</p>
                  </div>
                  <div className='s-card'>
                    <p className='c-head'>Bookings (Company) <i className='bx bx-user-check'></i></p>
                    <p className='c-value'>{CbookingsCount} Bookings</p>
                  </div>
                  <div className='s-card'>
                    <p className='c-head'>Accepted Sales (Company) <i className='bx bx-trending-up'></i></p>
                    <p className='c-value'>Rs {CompSales}</p>
                  </div>
                  <div className='s-card'>
                    <p className='c-head'>Sales (Subscription)<i className='bx bx-trending-up'></i></p>
                    <p className='c-value'>Rs {totalSales}</p>
                  </div>
                </div>
                  <div className='CompanyCrud'>

                  <p className='page-des'> Individual Sales</p>    
                    <Table  hover variant="dark" responsive>
                      <thead>
                        <tr>
                          <th className='thead'>Booking Id</th>
                          <th className='thead'>DriverId</th>
                          <th className='thead'>Date_of_Acceptance</th>
                          <th className='thead'>Pick_up_date</th>
                          <th className='thead'>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                      {IndividualSales.map((IndividualSales) => {
                          const date = new Date(IndividualSales.Date_of_Acceptance);
                          const formattedDate = date.toLocaleDateString(); 
                          const formattedTime = date.toLocaleTimeString();
                          return (
                          <tr key={IndividualSales.BookingId}>
                            <td>{IndividualSales.BookingId}</td>
                            <td>{IndividualSales.DriverId}</td>
                            <td>{`${formattedDate} ${formattedTime}`}</td>
                            <td>{IndividualSales.Date_of_Pickup}</td>
                            <td>{IndividualSales.Sales}</td>
                          </tr>
                        )})}
                      </tbody>
                    </Table>

                    <p className='page-des'> Company Sales</p>    
                    <Table  hover variant="dark" responsive>
                      <thead>
                        <tr>
                          <th className='thead'>Booking Id</th>
                          <th className='thead'>CompanyId</th>
                          <th className='thead'>Date_of_Acceptance</th>
                          <th className='thead'>Pick_up_date</th>
                          <th className='thead'>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                      {CompanySales.map((CompanySales) => {
                        const date = new Date(CompanySales.Date_of_Acceptance);
                        const formattedDate = date.toLocaleDateString(); 
                        const formattedTime = date.toLocaleTimeString();
                        return (
                          <tr key={CompanySales.BookingId}>
                            <td>{CompanySales.BookingId}</td>
                            <td>{CompanySales.CompanyId}</td>
                            <td>{`${formattedDate} ${formattedTime}`}</td>
                            <td>{CompanySales.Date_of_Pickup}</td>
                            <td>{CompanySales.Sales}</td>
                          </tr>
                        )})}
                      </tbody>
                    </Table>

                    <p className='page-des'>Sales</p>    
                    <Table  hover variant="dark" responsive>
                      <thead>
                        <tr>
                          <th className='thead'>Recipt Ref</th>
                          <th className='thead'>Driver_Company_id</th>
                          <th className='thead'>Date_of_Deposit</th>
                          <th className='thead'>Submit_Time</th>
                          <th className='thead'>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                      {sales.map((sales) => {
                        const date = new Date(sales.Date_of_Deposit);
                        const formattedDate = date.toLocaleDateString(); 
                        const formattedTime = date.toLocaleTimeString();
                        const date1 = new Date(sales.Submit_Time);
                        const formattedDate1 = date1.toLocaleDateString(); 
                        const formattedTime1 = date1.toLocaleTimeString();
                        return (
                          <tr key={sales.Recipt_Ref}>
                            <td>{sales.Recipt_Ref}</td>
                            <td>{sales.Driver_Company_id}</td>
                            <td>{`${formattedDate} ${formattedTime}`}</td>
                            <td>{`${formattedDate1} ${formattedTime1}`}</td>
                            <td>{sales.Amount}</td>
                          </tr>
                        )})}
                      </tbody>
                    </Table>

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
      </div>    
    </>
  )
}

export default Admin

const DriverEdit = ({id}) => {

  const userId = `DriverNo${id}`;

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
        e.target.reset(); 
      } else if (response.data.alert === 'Error updating driver details.') {
        alert('Error updating driver details')
      }
      })
      .catch(err => {
        console.log(err);
        alert('An error occurred while updating driver details');
      })  
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
        e.target.reset(); 
      } else if (response.data.alert === 'Error updating vehicle details.') {
        alert('Error updating vehicle details')
      }
      })
      .catch(err => {
        console.log(err);
        alert('An error occurred while updating vehicle details');
      })
    }
  
  return(
    <>
      <form className='fillup' onSubmit={handleDriverAlterations}>

                <div id='tab'>

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
              <textarea maxLength = "40" rows = "4" name='description' onChange={handleChange}/>


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
                <Location id='location' name='clossetTown' onChange={handleChange}
                />

              <button className='editbutton' type='submit' value='submit'>Edit</button>

              </div>

            </form>
    </>
  )
}

const DriverImages = ({id, state}) => {
 


  return(
    <>
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
                  <td className='user-feilds'>Full Name</td>
                  <td className='user-records'>{state.fullName}</td>
                </tr>
                <tr>
                  <td className='user-feilds'>User Name</td>
                  <td className='user-records'>{state.userName}</td>
                </tr>
                <tr>
                  <td className='user-feilds'>Age</td>
                  <td className='user-records'>{state.age}</td>
                </tr>
                <tr>
                  <td className='user-feilds'>Contact</td>
                  <td className='user-records'>{state.mobileNumber}</td>
                </tr>
                <tr>
                  <td className='user-feilds'>Residential Address</td>
                  <td className='user-records'>{state.addressLine1}, {state.addressLine2}</td>
                </tr>
                <tr>
                  <td className='user-feilds'>Driver License Number</td>
                  <td className='user-records'>{state.licenseNumber}</td>
                </tr>
                <tr>
                  <td className='user-feilds'>Driver National ID Number</td>
                  <td className='user-records'>{state.nationalIdNumber}</td>
                </tr>
                </tbody>
              </table>

      
        <div className='cards'>

        <div className='image-card'>

          <img src={`${url}/images/DriverNo${id}/${state.licenseFrontImage}`} alt='License Front'/>
          <p className='card-txt'>Driver License Front Image</p>

        </div>
        <div className='image-card'>

          <img src={`${url}/images/DriverNo${id}/${state.licenseBackImage}`} alt='License Back'/>
          <p className='card-txt'>Driver License Back Image</p>

        </div>
        <div className='image-card'>

          <img src={`${url}/images/DriverNo${id}/${state.nationalIdFrontImage}`} alt='ID Front'/>
          <p className='card-txt'>Driver ID Card Front Image</p>

        </div>
        <div className='image-card'>

          <img src={`${url}/images/DriverNo${id}/${state.nationalIdBackImage}`} alt='ID Back'/>
          <p className='card-txt'>Driver ID Card Back Image</p>

        </div>
      </div>

    </>
  )
}

const CompanyData = ({id, state}) => {

  
  return (
    <>
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
                  <td className='user-feilds'>Company Name</td>
                  <td className='user-records'>{state['companyName']}</td>
                </tr>
                <tr>
                  <td className='user-feilds'>Company Address 1</td>
                  <td className='user-records'>{state['companyAddressLine1']}</td>
                </tr>
                <tr>
                  <td className='user-feilds'>Company Address 2</td>
                  <td className='user-records'>{state['companyAddressLine2']}</td>
                </tr>
                <tr>
                  <td className='user-feilds'>Company Phno1</td>
                  <td className='user-records'>{state.companyPhno1}</td>
                </tr>
                <tr>
                  <td className='user-feilds'>Company Phno2</td>
                  <td className='user-records'>{state.companyPhno2}</td>
                </tr>
                <tr>
                  <td className='user-feilds'>Company Email</td>
                  <td className='user-records'>{state.companyEmail}</td>
                </tr>
                </tbody>
              </table>

              <div className='cards'>
              <div className='image-card'>

                <embed src={`${url}/images/CompanyNo${id}/${state.driverDetails}`} alt='driver_details'/>
                <p className='card-txt'>driver_details</p>

              </div>
              <div className='image-card'>

                <embed src={`${url}/images/CompanyNo${id}/${state.vehicleDetails}`} alt='vehicle_details'/>
                <p className='card-txt'>vehicle_details</p>

              </div>

            </div>
    </>
  )
}

const CompanyEdit = ({id}) => {
  
  const companyId = `CompanyNo${id}`;

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


  return(
    <>
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
    </>
  )
}