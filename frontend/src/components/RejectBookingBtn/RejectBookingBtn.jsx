import React from 'react'
import './style.css'
import axios from 'axios'
import { URL } from '../../utils/url'
import { toast } from 'react-toastify'
const RejectBookingBtn = ({ booking_status, userId, vehicleId }) => {
    const StatusSyle = {
        backgroundColor: '#D3D3D3'
    }
    const RejectBookingHandler = () => {
        axios.post(URL + '/admin/api/reject-booking', {
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
        booking_status == "PENDING" ?
            <button className='reject-btn' onClick={RejectBookingHandler}> REJECT </button>
            :
            booking_status == "REJECTED"
            ?
            <button className='reject-btn' disabled > {booking_status} </button>
            :
            <button className='reject-btn' disabled style={StatusSyle} > REJECT </button>
    )
}

export default RejectBookingBtn
