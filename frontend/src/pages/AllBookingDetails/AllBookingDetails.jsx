import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { URL } from '../../utils/url';
import SortByStatus from '../../components/SortByStatus/SortByStatus';
import StatusButton from '../../components/StatusButton/StatusButton';
import PaymentStatusBtn from '../../components/PaymentStatus/PaymentStatusBtn';
import RejectBookingBtn from '../../components/RejectBookingBtn/RejectBookingBtn';
import AcceptBookingBtn from '../../components/AcceptBookingBtn/AcceptBookingBtn';
import AcceptCancellation from '../../components/AcceptCancellation/AcceptCancellation';
import { useDispatch, useSelector } from 'react-redux';
import { COMMON } from '../../redux/constants/common';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import Navbar from '../../components/Navbar/Navbar';

const AllBookingDetails = () => {
    const [bookings, setBookings] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.bookedDetails);

    useEffect(() => {
        dispatch({ type: COMMON.FETCH_BOOKED_DETAILS_REQUEST });
        axios.get(URL + '/admin/api/all-booking-details').then(res => {
            console.log(res.data)
            setBookings(res.data);
            dispatch({ type: COMMON.FETCH_BOOKED_DETAILS_SUCCESS, payload: res.data });
        }).catch((err) => {
            navigate('/');
            toast.error("Error on fetching Bookings", {
                position: toast.POSITION.BOTTOM_CENTER
            })
        })
    }, []);

    return (
        loading ?
            <Loader />
            :
            <>
                <Navbar />
                <div className='booked'>
                    <section className="container">
                        <div className='booked-header'>
                            <h1>All Vechicle Bookings</h1>
                            <SortByStatus setVehicles={setBookings} />
                        </div>
                        <div class="table-box">
                            <div class="table-row table-head">
                                <div class="table-cell first-cell">
                                    <p>ID</p>
                                </div>
                                <div class="table-cell">
                                    <p>Status</p>
                                </div>
                                <div class="table-cell">
                                    <p>Payment</p>
                                </div>
                                <div class="table-cell">
                                    <p>Accept</p>
                                </div>
                                <div class="table-cell">
                                    <p>Reject</p>
                                </div>
                                <div class="table-cell last-cell">
                                    <p>Cancellation</p>
                                </div>
                            </div>
                            {
                                bookings.map((value, index) => {
                                    return (
                                        <div key={index} class="table-row">
                                            <div class="table-cell first-cell">
                                                <p> {value.bookingList._id}</p>
                                            </div>
                                            <div class="table-cell">
                                                <StatusButton status={value.bookingList.booking_status} />
                                            </div>
                                            <div class="table-cell">
                                                <p style={{ color: '#4BB543' }}>{value.bookingList.payment.status ? "SUCCESS" : "PENDING"} </p>
                                            </div>
                                            <div class="table-cell">
                                                <AcceptBookingBtn userId={value.userId} vehicleId={value.bookingList._id} booking_status={value.bookingList.booking_status} />
                                            </div>
                                            <div class="table-cell">
                                                <RejectBookingBtn booking_status={value.bookingList.booking_status} userId={value.userId} vehicleId={value.bookingList._id} />
                                            </div>
                                            <div class="table-cell last-cell">
                                                {
                                                    value.bookingList.cancel_status ?
                                                        <AcceptCancellation userId={value.userId} status={value.bookingList.cancel_status} vehicleId={value.bookingList._id} />
                                                        :
                                                        <p>Not requested</p>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }


                        </div>
                    </section>
                </div>
            </>

    )
}

export default AllBookingDetails
