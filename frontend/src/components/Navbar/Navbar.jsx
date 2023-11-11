import React, { useEffect, useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import Logout from '../Logout/Logout';
import { getItem } from '../../../localStorage/getItem';

const Navbar = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userData = getItem('user');
    setUser(userData)
  }, [])

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container navbar-wrapper">
          <input type="checkbox" name="" id="" />
          <div className="hamburger-lines">
            <span className="line line1"></span>
            <span className="line line2"></span>
            <span className="line line3"></span>
          </div>
          <ul className="menu-items">
            <li><Link to={user?.admin ? '/all-booking-details' : '/booked-details'}>Bookings</Link></li>
            <li><Link to={'/admin-profile'}>Profile</Link></li>
            <li><Link><Logout /></Link></li>
          </ul>
          <Link to={'/'}>
            <h1 className="logo">Vehicles</h1>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Navbar