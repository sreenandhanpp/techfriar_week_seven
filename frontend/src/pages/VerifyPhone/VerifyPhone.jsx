import React, { useEffect, useState } from 'react';
import { getItem } from '../../../localStorage/getItem';
import { setItem } from '../../../localStorage/setItem';
import Verfy from '../../components/Verify/Verfy';
import { maskPhone } from '../../utils/maskPhone';
import { URL } from '../../utils/url';
import { USER } from '../../redux/constants/user';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './style.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import SendPhoneOtp from '../SendPhoneOtp/SendPhoneOtp';

const VerifyPhone = () => {
  const [msg, setMsg] = useState('');
  const [otps, setOtps] = useState({
    digitOne: "",
    digitTwo: "",
    digitThree: "",
    digitFour: "",
  });
  const [color, setColor] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector(state => state.verify);
  const resendLoading = useSelector(state => state.resendOtp.loading);
  // Handle changes in input fields by updating the OTP (One-Time Password) state.
  const HandleChange = (e) => {

    // Update the OTP state using the spread operator to maintain previous values
    setOtps((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  //Taking data from localstorage useing getItem function
  const userData = getItem('user');

  /**
 * React useEffect hook to set a message containing a masked phone number for user verification.
 * This effect runs once after component mounting.
 */
  useEffect(() => {
    // Mask the user's phone number for privacy
    let maskedPhone = maskPhone(userData.phone);
    let text = `We have sent a verification code to ${maskedPhone}`;
    setMsg(text);
  }, []);

  /**
 * Validates the entered OTP (One-Time Password).
 * Checks if the OTP is a four-digit number and updates the message accordingly.
 * Returns 'true' if validation fails, 'false' otherwise.
 */
  const HandleValidation = () => {
    const otpRegex = /^\d{4}$/; // Regular expression for a four-digit OTP
    const otp = otps.digitOne + otps.digitTwo + otps.digitThree + otps.digitFour; // Concatenate OTP digits
    if (!otpRegex.test(otp)) {
      setMsg("otp must be four digit,check your inbox"); // Update the error message
      return true; // Return 'true' to indicate validation failure
    }
  }
  // Handle the user's request to verify an OTP (One-Time Password) for phone.
  const HandleVerify = (e) => {
    e.preventDefault();
    const isErr = HandleValidation();

    if (!isErr) {
      // Dispatch an action to indicate the OTP verification request is in progress
      dispatch({ type: USER.VERIFY_OTP_REQUEST });

      // Send a POST request to the server to verify the email OTP  
      axios.post(URL + '/user/api/verify-phone-otp', {
        id: userData.id,
        otp: otps.digitOne + otps.digitTwo + otps.digitThree + otps.digitFour
      }).then(res => {

        //setting phoneVerified to true and update in localstorage for further validation
        userData.phoneVerified = true;
        userData.verified = true;
        setItem('user', userData);

        // Dispatch an action to indicate a successful OTP verification
        dispatch({ type: USER.VERIFY_OTP_SUCCESS, payload: res.data.message });

        // Display a success message to the user
        toast.success(res.data.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });

        // Navigate the user to the '/send-aadhar' route upon successful verification
        navigate('/');
      }).catch(err => {

        // Dispatch an action to indicate a failed OTP verification
        dispatch({ type: USER.VERIFY_OTP_FAILED, error: err.response.data.message });

        // Set the color to red and display an error message
        setColor('red');
        setMsg(err.response.data.message);
      });
    }
  }

  // Handle the user's request to resend an OTP (One-Time Password) via email.
  const HandleResend = (e) => {
    e.preventDefault(e);

    // Dispatch an action to indicate the OTP resend request is in progress
    dispatch({ type: USER.RESEND_OTP_REQUEST });

    // Send a POST request to the server to resend the email OTP
    axios.post(URL + '/user/api/resend-phone-otp', {
      id: userData.id,
      phone: userData.phone
    }).then(res => {

      // Dispatch an action to indicate a successful OTP resend
      dispatch({ type: USER.RESEND_OTP_SUCCESS, payload: res.data.message });

      // Set the color to green and update the message
      setColor('green');
      setMsg(res.data.message);
    }).catch(err => {

      // Dispatch an action to indicate a failed OTP resend
      dispatch({ type: USER.RESEND_OTP_FAILED, error: err.message });

      // Set the color to red and display an error message
      setColor('red');
      setMsg(err.response.data.message);
    });
  }


  return (
    loading || resendLoading ?
      <Loader />
      :
      userData.sendPhone?
      <Verfy
        msg={msg}
        color={color}
        HandleResend={HandleResend}
        HandleChange={HandleChange}
        HandleVerify={HandleVerify}
      />
      :
      <SendPhoneOtp />
  )
}

export default VerifyPhone