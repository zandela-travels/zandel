import React from 'react'
import { useState } from 'react'
import './Goride.css'
import Vehbox from '../../Vehicle box/Vhbox'
import { Button } from 'react-bootstrap'
import Rental from '../../Rental/Rental'





const Goride = () => {
  
  const [tabs, setTabs] = useState(1)
  const toggleTab = (index) => {
    setTabs(index);
  } 
    return (
    <>
      <div id='cont4'>
        <div id='maincont'>
        <div id='vehiclecont'>
        <p className='statement'>Feel free to choose either ‘Book a Vehicle’ if you’d like a driver or ‘Rent a Vehicle’ for a driverless option.</p>
          <div className='vehtabs'>
            <Button variant={tabs === 1? 'dark' : 'outline-dark'} onClick={() => toggleTab(1)}>Book a Vehicle</Button>
            <Button variant={tabs === 2? 'dark' : 'outline-dark'} onClick={() => toggleTab(2)}>Rent a Vehicle</Button>
          </div>
          <div className={tabs === 1? 'vehpage active_vehpage' : 'vehpage'}>
            <Vehbox/>
          </div>
          <div className={tabs === 2? 'vehpage active_vehpage' : 'vehpage'}>
            <Rental/>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}

export default Goride;

