import React from 'react'
import './style.css'
import { URL } from '../../utils/url'
import axios from 'axios'
import { toast } from 'react-toastify'
const AcceptBookingBtn = ({ userId, vehicleId, booking_status }) => {
    const BookingAcceptHandler = () => {
        axios.post(URL + '/admin/api/accept-booking', {
            userId: userId,
            vehicleId: vehicleId
        }).then(res => {
            window.location.reload()
            toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }).catch(err => {
            toast.error(err.response.data.message, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        })
    }
    const StatusStyle = {
        backgroundColor: '#D3D3D3'
    }

    return (
        booking_status == "PENDING" ?
            <button className='accept-btn' onClick={BookingAcceptHandler}> ACCEPT </button>
            :
            booking_status == "SUCCESS"
                ?
                <button className='accept-btn' disabled > ACCEPTED </button>
                :
                <button className='accept-btn' disabled style={StatusStyle}> ACCEPT </button>

    )
}

export default AcceptBookingBtn
