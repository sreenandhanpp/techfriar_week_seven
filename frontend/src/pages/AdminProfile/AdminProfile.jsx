import React, { useEffect, useState } from 'react';
import { getItem } from '../../../localStorage/getItem';
import { Link } from 'react-router-dom';

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
    const [url,setUrl] = useState('');
   
    useEffect(() => {
        if (userData) {
            if(userData.profile_image){
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
        <div>
            <h2>Name:{adminDetails.name} </h2>
            <p>phone: {adminDetails.phone} </p>
            <p>email: {adminDetails.email} </p>
            <h4>Address</h4>
            <p>country: {adminDetails.country} </p>
            <p>state: {adminDetails.state} </p>
            <p>city: {adminDetails.city} </p>
            <p>pincode: {adminDetails.pincode} </p>
            <img src={url} alt="" />
            <Link to={'/edit-admin-profile'}> <button>Edit </button> </Link>
        </div>
    )
}

export default AdminProfile
