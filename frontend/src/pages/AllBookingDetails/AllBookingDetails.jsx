import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { URL } from '../../utils/url';
import SortByStatus from '../../components/SortByStatus/SortByStatus';
import StatusButton from '../../components/StatusButton/StatusButton';
import PaymentStatusBtn from '../../components/PaymentStatus/PaymentStatusBtn';
import RejectBookingBtn from '../RejectBookingBtn/RejectBookingBtn';
import AcceptBookingBtn from '../AcceptBookingBtn/AcceptBookingBtn';

const AllBookingDetails = () => {
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        axios.get(URL + '/admin/api/all-booking-details').then(res => {
            setBookings(res.data);
        });
    })
    return (
        <div className='booked'>
            <section className="container">
                <div className='booked-header'>
                    <h1>Booked Vechicles</h1>
                    <SortByStatus setVehicles={setBookings} />
                </div>
                <ul className="products">

                    {
                        bookings.map((value, index) => {
                            return (
                                <li className="row" key={index}>
                                    <div className="col left">
                                        <div className="thumbnail">
                                            <h4>{index + 1}  </h4>
                                        </div>
                                        <div className="detail">
                                            <div className="description">{value.bookingList._id}</div>
                                        </div>
                                    </div>
                                    <div className="col right">
                                        <div className="quantity">
                                            <p className='booked-span-1'>Booked Status:</p>
                                            <p className='booked-span-2'>Payment Status:</p>
                                            <p className='booked-span-3'>Reject Booking:</p>
                                            <p className='booked-span-3'>Accept Booking:</p>
                                        </div>

                                        <div className="remove">
                                            <StatusButton status={value.bookingList.booking_status} />
                                            <PaymentStatusBtn status={value.bookingList.payment_status} booking_status={value.bookingList.booking_status} />
                                            <RejectBookingBtn booking_status={value.bookingList.booking_status} userId={value.userId} vehicleId={value.bookingList._id}/>
                                            <AcceptBookingBtn userId={value.userId} vehicleId={value.bookingList._id} booking_status={value.bookingList.booking_status} />
                                        </div>
                                    </div>
                                </li>
                            );
                        })
                    }
                </ul>
            </section>
        </div>
    )
}

export default AllBookingDetails
