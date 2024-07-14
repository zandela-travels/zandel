import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import lgo from '../Images/sidelogo.png';
import Location from '../Location/Location';
import Button from 'react-bootstrap/Button';






const Sidebar = ({setFilters}) => {
  const [localFilters, setLocalFilters] = useState({
    individual: false,
    organisation: false,
    vehicleType: 'Any',
    location: ''
  });

  const setLocation = (location) => {
    setLocalFilters(prevFilters => ({
      ...prevFilters,
      location: location
    }));
  };

  const handleFilters = () => {
    setFilters(localFilters);
  }

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setLocalFilters(prevFilters => ({
      ...prevFilters,
      [id]: checked
    }));
  };

  const handleDropdownChange = (event) => {
    const { value } = event.target;
    setLocalFilters(prevFilters => ({
      ...prevFilters,
      vehicleType: value
    }));
  };

  return (
    <div id='sidebarform'>
      <img src={lgo} alt='logo'></img>

      <div className='filterbox'>
        <h4 className='fhead'>Filters</h4>
        <hr />

        <label className='chk'>
          Individual:
          <input type='checkbox' id='individual' checked={localFilters.individual} onChange={handleCheckboxChange} />
        </label>

        <label className='chk'>
          Organisations:
          <input type='checkbox' id='organisation' checked={localFilters.organisation} onChange={handleCheckboxChange} />
        </label>

        <label className='chk'>Choose a type of Vehicle:</label>
        <select id="vehicleType" name="vehicleType" value={localFilters.vehicleType} onChange={handleDropdownChange}>
          <option value="Any">Any</option>
          <option value="CAR(4 seats)">CAR(4 seats)</option>
          <option value="VAN(10 seats - 15 seats)">VAN(10 seats - 15 seats)</option>
          <optgroup label='BUS'>
            <option value="Bus (seats(25-29))">1. Bus (seats(25-29))</option>
            <option value="Bus (seats(40-54))">2. Bus (seats(40-54))</option>
            <option value="Bus (seats(54-58))">3. Bus (seats(54-58))</option>
          </optgroup>
        </select>

        <label className='chk'>Your starting location:</label>
        <Location setLocation={setLocation} />

        <Button className='addfilter' variant="outline-info" onClick={handleFilters}>Add filters</Button>

        <hr />
      </div>

    </div>
  );
};

export default Sidebar;

