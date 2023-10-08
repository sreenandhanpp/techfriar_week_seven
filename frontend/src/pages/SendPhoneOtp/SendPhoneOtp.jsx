import React, { useEffect, useState } from 'react';
import { getItem } from '../../../localStorage/getItem';
import { setItem } from '../../../localStorage/setItem';
import axios from 'axios';
import SendOtp from '../../components/SendOtp/SendOtp';
import { URL } from '../../utils/url';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { USER } from '../../redux/constants/user';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import 'react-toastify/dist/ReactToastify.css';
import { maskPhone } from '../../utils/maskPhone';


const SendPhoneOtp = () => {
    const [msg, setMsg] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Taking data from localstorage useing getItem function
    const userData = getItem('user');

    //getting state from global state
    const { loading } = useSelector(state => state.sendOtp);

    // Use the useEffect hook to process user phone data and generate a masked phone message.
    useEffect(() => {
        let maskedPhone = maskPhone(userData.phone);
        let text = `Click the send button to recieve otp to ${maskedPhone}`;
        setMsg(text);
    }, []);

    // Handle a user's request to send an phone OTP (One-Time Password).
    const HandleRequest = (e) => {
        e.preventDefault();
        try {
            // Dispatch an action to indicate the request is in progress
            dispatch({ type: USER.SEND_OTP_REQUEST });

            // Send a POST request to the server to send an phone OTP
            axios.post(URL + '/user/api/send-phone-otp', {
                id: userData.id,
                phone: userData.phone
            }).then(res => {
                if (res.status == 200) {
                    // Display a success message to the user
                    toast.success(res.data.message, {
                        position: toast.POSITION.BOTTOM_CENTER
                    });

                    //setting sendPhone to true and update in localstorage for further validation
                    userData.sendPhone = true;
                    setItem('user', userData);

                    // Dispatch an action to indicate a successful email OTP send
                    dispatch({ type: USER.SEND_OTP_SUCCESS });

                    // Redirecting to verify phone page using useNavigate hook
                    navigate('/verify-phone');
                }
            }).catch(err => {
                // Dispatch an action to indicate a failed phone OTP send
                dispatch({ type: USER.SEND_OTP_FAILED });

                // Display an error message to the user
                toast.error(err.data.message, {
                    position: toast.POSITION.BOTTOM_CENTER
                });

            });
        } catch (error) {
            // Dispatch an action to indicate a failed phone OTP send
            dispatch({ type: USER.SEND_OTP_FAILED });

            // Display a generic error message to the user
            toast.error("Somthing went wrong", {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
    }
    return (
        loading ?
            <Loader />
            :
            <div>
                <SendOtp msg={msg} HandleAction={HandleRequest} color={'green'} />
            </div>
    )
}

export default SendPhoneOtp