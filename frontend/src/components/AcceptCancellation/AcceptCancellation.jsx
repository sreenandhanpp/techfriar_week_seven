import axios from 'axios';
import React, { useState } from 'react';
import { URL } from '../../utils/url';
import { toast } from 'react-toastify';
import './style.css';

const AcceptCancellation = ({ status, userId, vehicleId }) => {
    const HandleCancellation = () => {
        axios.post(URL + '/admin/api/cancel-booking', {
            userId: userId,
            vehicleId: vehicleId
        }).then(res => {
            toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_CENTER
            });
            window.location.reload()
        }).catch(err => {
            toast.error(err.response.data.message, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        })
    }
    return (
        status == "REQUESTED"
            ?
            <button className='accept-cancellation-btn' onClick={() => HandleCancellation(vehicleId)} >CANCEL</button>
            :
            <button className='accept-cancellation-btn' >CANCELLED</button>

    )
}

export default AcceptCancellation
