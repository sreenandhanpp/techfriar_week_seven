import React, { useEffect, useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import Logout from '../Logout/Logout';

const Navbar = () => {
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
            <li><Link>Cart</Link></li>
            <li><Link to={'/booked-details'}>Bookings</Link></li>
            <li><Link><Logout /></Link></li>
          </ul>
          <h1 className="logo">Vehicles</h1>
        </div>
      </nav>
    </div>
  )
}

export default Navbar