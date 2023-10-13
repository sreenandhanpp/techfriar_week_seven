import React, { useEffect } from 'react';
import { getItem } from '../../../localStorage/getItem';
import { Link } from 'react-router-dom';

const AdminProfile = () => {
    const [adminDetails, setAdminDetails] = ({
        name: '',
        phone: '',
        email: '',
        pincode: '',
        state: '',
        country: '',
        city: '',
        profile: '',

    });
    useEffect(() => {
        const userData = getItem('user');
        if (userData) {
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
                    profile: userData.profile_image.url
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
            <img src={adminDetails.profile} alt="" />
            <Link to={'/edit-admin-profile'}> <button>Edit </button> </Link>
        </div>
    )
}

export default AdminProfile
