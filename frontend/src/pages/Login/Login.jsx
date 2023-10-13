import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { USER } from '../../redux/constants/user';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Loading from '../../components/Loader/Loader';
import { URL } from '../../utils/url';
import Alert from '../../components/Alert/Alert';
import './style.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notMatchErr, setNotMatchErr] = useState('');
    const navigate = useNavigate();
    const [err, setErr] = useState([]);

    // Get access to the Redux 'dispatch' function
    const dispatch = useDispatch();

    // Extract the 'loading' property from the 'login' slice of the Redux store
    const { loading } = useSelector(state => state.login);

    // 'loading' likely represents whether a login-related asynchronous operation is in progress

    // Define a function to handle user login form submission
    const HandleLogin = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Try to initiate the login process
        try {
            // Dispatch an action to indicate the start of the login request
            dispatch({ type: USER.LOGIN_REQUEST });

            // Make an HTTP POST request to the login API
            axios.post(URL + '/user/api/login', {
                email,
                password
            }).then(res => {
                if (res.status === 200) {
                    // If login is successful, dispatch a success action with user data
                    dispatch({ type: USER.LOGIN_SUCCESS, payload: res.data });

                    // Check if the user is an admin and navigate accordingly
                    if (res.data.isAdmin) {
                        navigate('/admin', { replace: true });
                    } else {
                        navigate('/', { replace: true });
                    }
                } else {
                    // If login is not successful, dispatch a failure action
                    dispatch({ type: USER.LOGIN_FAILED });
                }
            }).catch(error => {
                // Dispatch a failure action in case of an error response
                dispatch({ type: USER.LOGIN_FAILED });

                if (error) {
                    if (error.response.data.errors) {
                        // Set errors if there are validation errors
                        setErr(error.response.data.errors);
                    } else {
                        //emptying previos error
                        setErr('');
                        // Set an error message for other types of errors
                        setNotMatchErr(error.response.data.error);
                    }
                }
            })
        } catch (err) {
            // Dispatch a failure action if an error occurs during the login process
            dispatch({ type: USER.LOGIN_FAILED, payload: "something went wrong" });
        }
    }


    return (

        loading ? <Loading />
            :
            <div className="form-container">
                <div id="FormContainer">
                    <div className="ImgContainer">
                    </div>

                    <form id="Form" className='login-form'>
                        <h1 id="FormHeading">Sign In</h1>

                        <li>
                            <label>Email:</label>
                            <input type="email" name='email' onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                            <Alert label={'email'} errors={err} />
                        </li>
                        <li>
                            <label>Password:</label>
                            <input type="password" name='password' onChange={(e) => setPassword(e.target.value)} placeholder="Enter your email" />
                            <Alert label={'password'} errors={err} />
                        </li>
                        {
                            notMatchErr && <p className='alert'> *{notMatchErr} </p>
                        }

                        <button onClick={e => HandleLogin(e)} >Sign In</button>
                    </form>
                </div>
            </div>
    )
}

export default Login
