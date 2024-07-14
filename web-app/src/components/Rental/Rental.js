import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';




const url = process.env.REACT_APP_SERVER;


const Rental = () => {
    const [companyData, setCompanyData] = useState([]);
    const [individualData, setIndividualData] = useState([]);
  
    const logAccess = (type, id) => {
      const endpoint = type === 'individual' ? '/log_individual_access' : '/log_company_access';
      axios.post(`${url}${endpoint}`, { id })
        .then(response => {
          console.log(response.data.message);
        })
        .catch(error => {
          console.error('There was an error logging access!', error);
        });
    };
  
  
    useEffect(() => {
      axios.post(`${url}/comp_front_rental_details`)
        .then(response => {
          setCompanyData(response.data);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }, []);
  
    useEffect(() => {
      axios.post(`${url}/indi_front_rental_details`)
        .then(response => {
          setIndividualData(response.data);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }, []);
  
    return (
      <>
  {individualData.map((individual, index) => (
          <div id='vehicledes' key={index}>
            <img id='adi' src={`${url}/images/${individual.driverId}/${individual.vimage1}`} alt='Vehicle'/>
            <div id='para'>
              <h5 className='box-tittle'>{individual.model}({individual.clossestTown})</h5>
              <p id='box-para'>{individual.description}</p>
              <Link className='link3' to={`/Driver/${individual.driverId}`} onClick={() => logAccess('individual', individual.driverId)}>More Info</Link>
            </div>
          </div>
        ))}
  
        {companyData.map((company, index) => (
          <div id='vehicledes' key={index}>
            <img id='adi' src={`${url}/images/CompanyNo${company.id}/${company.companyImage2}`} alt='Company'/>
            <div id='para'>
              <h5 className='box-tittle'>{company['companyName']}</h5>
              <p id='box-para'>{company.description}</p>
              <Link className='link3' to={`/company/CompanyNo${company.id}`} onClick={() => logAccess('company', `CompanyNo${company.id}`)}>More Info</Link>
            </div>
          </div>
        ))}
        
      </>
    )
  }

export default Rental
