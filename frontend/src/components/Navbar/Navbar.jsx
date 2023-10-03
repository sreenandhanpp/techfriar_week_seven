import React from 'react';
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import { clearStorage } from '../../../localStorage/clearStorage';
import { URL } from '../../utils/url';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const HandleClear = async () => {
    clearStorage();
    await axios.get(URL+'/clear');
    navigate('/signup');
  }
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
                <li><Link onClick={HandleClear}>Clear data</Link></li>
            </ul>
            <h1 className="logo">Hi,</h1>
        </div>
    </nav>
    </div>
  )
}

export default Navbar