import React from 'react'
import { getItem } from '../../../localStorage/getItem'
import axios from 'axios';
import { URL } from '../../utils/url';
import { toast } from 'react-toastify';
import { clearStorage } from '../../../localStorage/clearStorage';
import './style.css'

// Function to handle user logout
const HandleLogout = () => {
    // Get user data from local storage (assuming getItem and clearStorage functions are defined elsewhere)
    const userData = getItem('user');

    // Send a GET request to the logout API endpoint
    axios.get(URL + '/user/api/logout').then(async (res) => {
        // If the server responds with a 200 (OK) status code
        if (res.status == 200) {
            // Clear user data from local storage
            await clearStorage();

            // Display a success message using a toast notification
            toast.success("Signed out successfully", {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
    });
}

const Logout = () => {
    return (
        <button onClick={HandleLogout} className='logout-btn'>Logout</button>
    )
}

export default Logout