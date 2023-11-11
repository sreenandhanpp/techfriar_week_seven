import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import { URL } from '../../utils/url';
import { toast } from 'react-toastify';
import { getItem } from '../../../localStorage/getItem';

const BookNow = () => {
    // Destructuring properties 'loading' and 'data' from the 'product' slice of the Redux state
    const { loading, data } = useSelector(state => state.product);

    // Retrieving user data, presumably from local storage
    const userData = getItem('user');

    // Defining a function 'HandleBooking' to handle the booking process
    const HandleBooking = () => {
        // Making an HTTP POST request to create a checkout session
        axios.post(URL + '/user/api/create-checkout-session', {
            proId: data._id,          // Sending the product ID from the 'data' object
            userId: userData.id      // Sending the user's ID from 'userData'
        })
            .then(res => {
                // If a 'url' property exists in the response data, redirect the user to that URL
                if (res.data.url) {
                    window.location.href = res.data.url;
                } else {
                    toast.warn(res.data.message, {
                        position: toast.POSITION.BOTTOM_CENTER
                    })
                }
            })
            .catch(err => {
                // If there's an error during the request, display an error toast notification
                toast.error("Something went wrong", {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            })
    }

    return (
        <div type="button" onClick={() => HandleBooking()}>
            Book now
        </div>
    )
}

export default BookNow