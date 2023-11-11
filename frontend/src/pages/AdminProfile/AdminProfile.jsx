import React, { useEffect, useState } from 'react';
import { getItem } from '../../../localStorage/getItem';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './style.css';

const AdminProfile = () => {
    const userData = getItem('user');
    const [adminDetails, setAdminDetails] = useState({
        name: '',
        phone: '',
        email: '',
        pincode: '',
        state: '',
        country: '',
        city: '',
        profile: '',
    });
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (userData) {
            if (userData.profile_image) {
                setUrl(userData.profile_image.url);
            }
            setAdminDetails((prev) => {
                return {
                    ...prev,
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email,
                    pincode: userData.address.pincode,
                    state: userData.address.state,
                    country: userData.address.country,
                    city: userData.address.city,
                }
            }
            )
        }
    }, [])
    return (
        <>
        <Navbar />
        <div className="profile-wrapper">
            <div class="profile-container">
                <div class="profile-image">
                    <img src={url} alt="Profile Image" />
                </div>
                <div class="profile-details">
                    <h2> {adminDetails.name} </h2>
                    <p>Email: {adminDetails.email}</p>
                    <p>Phone: {adminDetails.phone}</p>
                    <p>Address: {adminDetails.city},{adminDetails.state},{adminDetails.pincode},{adminDetails.country}</p>
                    <Link to={'/edit-admin-profile'}> <button className='edit-button'>Edit </button> </Link>
                </div>
            </div>
        </div>
        </>
    )
}

export default AdminProfile
