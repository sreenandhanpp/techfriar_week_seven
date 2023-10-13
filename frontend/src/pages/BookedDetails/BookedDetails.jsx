import React, { useEffect, useState } from 'react'
import { getItem } from '../../../localStorage/getItem';
import axios from 'axios';
import { URL } from '../../utils/url';
import { COMMON } from '../../redux/constants/common';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import RupeesSymbol from '../../components/RupeesSymbol/RupeesSymbol';
import StatusButton from '../../components/StatusButton/StatusButton';
import PaymentStatusBtn from '../../components/PaymentStatus/PaymentStatusBtn';
import Loader from '../../components/Loader/Loader';
import SortByStatus from '../../components/SortByStatus/SortByStatus';
import { USER } from '../../redux/constants/user';
import { toast } from 'react-toastify';
import CancelButton from '../../components/CancelButton/CancelButton';


const BookedDetails = () => {
    const userData = getItem('user');
    const dispatch = useDispatch();
    const { loading, data } = useSelector(state => state.bookedDetails);
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        dispatch({ type: COMMON.FETCH_BOOKED_DETAILS_REQUEST });
        axios.post(URL + '/user/api/get-booked-products', {
            id: userData.id
        }).then(res => {
            console.log(res.data)
            dispatch({ type: COMMON.FETCH_BOOKED_DETAILS_SUCCESS, payload: res.data });
            setVehicles(res.data);
        }).catch(err => {
            console.log(err)
            dispatch({ type: COMMON.FETCH_BOOKED_DETAILS_FAILED, error: "error" });
        });
    }, []);

    const HandleCancelRequest = (proId) => {
        console.log(proId)
        dispatch({ type: USER.BOOKING_CANCEL_REQUEST });
        axios.post(URL + '/user/api/cancel-request', {
            userId: userData.id,
            proId: proId
        }).then(res => {
            console.log(res.data);
            dispatch({ type: USER.BOOKING_CANCEL_SUCCESS, payload: res.data.message });
            toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_CENTER
            });
            
        }).catch(err => {
            console.log(err)
            dispatch({ type: USER.BOOKING_CANCEL_FAILED, error: res.data })
            toast.error(res.data.message, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        })
    }
    return (
        loading ?
            <Loader />
            :
            (data.length == 0) ?
                <h3>You have not yet booked anything</h3>
                :
                <div className='booked'>
                    <section className="container">
                        <div className='booked-header'>
                            <h1>Booked Vechicles</h1>
                            <SortByStatus setVehicles={setVehicles} />
                        </div>
                        <ul className="products">

                            {
                                vehicles.map((vehicle, index) => {
                                    return (
                                        <li className="row" key={index}>
                                            <div className="col left">
                                                <div className="thumbnail">
                                                    <a href="#">
                                                        <img src={vehicle.images[0].url} alt={vehicle.name} />
                                                    </a>
                                                </div>
                                                <div className="detail">
                                                    <div className="name">
                                                        <a href="#">{vehicle.name}</a>
                                                    </div>
                                                    <div className="description">{vehicle.description.substring(0, 100) + "..."}</div>
                                                    <div className="price"> <RupeesSymbol /> {vehicle.price} </div>
                                                </div>
                                            </div>
                                            <div className="col right">
                                                <div className="quantity">
                                                    <p className='booked-span-1'>Booked Status:</p>
                                                    <p className='booked-span-2'>Payment Status:</p>
                                                    <p className='booked-span-3'>Cancel Booking:</p>
                                                </div>

                                                <div className="remove">
                                                    <StatusButton status={vehicle.bookingDetails.booking_status} />
                                                    <PaymentStatusBtn status={vehicle.bookingDetails.payment_status} />
                                                    {
                                                        vehicle.bookingDetails.cancel_status ?
                                                            <button className='cancel-btn' disabled onClick={() => HandleCancelRequest(vehicle._id)} >{vehicle.bookingDetails.cancel_status + "..."} </button>
                                                            :
                                                            <button className='cancel-btn' onClick={() => HandleCancelRequest(vehicle._id)} > CANCEL</button>

                                                    }
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

export default BookedDetails