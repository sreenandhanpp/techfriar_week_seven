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
    const StatusSyle = {
        backgroundColor: '#D3D3D3'
    }

    return (
        booking_status == "SUCCESS" || "REJECTED" ?
            <button className='accept-btn' disabled style={StatusSyle}> ACCEPTED </button>
            :
            <button className='accept-btn' onClick={BookingAcceptHandler}> ACCEPT </button>
    )
}

export default AcceptBookingBtn
