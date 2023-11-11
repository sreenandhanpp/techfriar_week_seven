import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { URL } from '../../utils/url';
import { USER } from '../../redux/constants/user';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import Alert from '../../components/Alert/Alert';
import { getItem } from '../../../localStorage/getItem';


const EditAdminProfile = () => {
    useEffect(() => {
        const userData = getItem('user');
        if (userData) {
            setFormValues((prev) => {
                return {
                    ...prev,
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email,
                    pincode: userData.address.pincode,
                    state: userData.address.state,
                    country: userData.address.country,
                    city: userData.address.city,
                }
            }
            )
        }
    }, [])
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        state: '',
        phone: '',
        city: '',
        country: '',
        pincode: '',
        password: '',
        confirmPassword: '',
        image: ''
    });
    const [err, setErr] = useState([]);
    const navigate = useNavigate();

    const userData = getItem('user');
    let img_id;
    if(userData.image){
         img_id = userData.image._id
    }else{
         img_id = null
    }
    // Get access to the 'dispatch' function from Redux
    const dispatch = useDispatch();

    // Extract the 'loading' property from the 'userData' slice of Redux state
    const { loading } = useSelector(state => state.userData);


    // Define a function to handle user signup form submission
    const HandleSignup = (e) => {
        
        e.preventDefault(); // Prevent the default form submission behavior
        // Try to initiate the signup process
        try {
            // Dispatch an action to indicate the start of the signup request
            dispatch({ type: USER.SIGNUP_REQUEST });
            console.log(formValues)
            // Make an HTTP POST request to the signup API with form data
            axios.post(URL + '/admin/api/update-admin-profile', {
                name: formValues.name,
                email: formValues.email,
                city: formValues.city,
                phone: formValues.phone,
                state: formValues.state,
                country: formValues.country,
                password: formValues.password,
                confirmPassword: formValues.confirmPassword,
                pincode: formValues.pincode,
                img_id: img_id,
                image: formValues.image,
                userId: userData.id
            }).then(res => {                
                // If signup is successful, dispatch a success action with user data
                    dispatch({ type: USER.SIGNUP_SUCCESS, payload: res.data });

                    // Navigate to the '/verify-email' route
                    navigate('/admin-profile');

                    // Display a success message using a toast notification
                    toast.success("Profile updated", {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
            }).catch(err => {
                console.log(err)
                if (err) {
                    // Set an error message if there's an error response
                    setErr(err.response.data.error);
                }

                // Dispatch a failure action with the error payload
                dispatch({ type: USER.SIGNUP_FAILED, payload: err });
            })
        } catch (err) {
            console.log(err)
            // Dispatch a failure action if an error occurs during the signup process
            dispatch({ type: USER.SIGNUP_FAILED, payload: err });
        }
    }


    // Handle changes in input fields by updating the OTP (One-Time Password) state.
    const HandleChange = (e) => {
        // Update the form field state using the spread operator to maintain previous values
        setFormValues((prev) => {
            return { ...prev, [e.target.name]: e.target.value }
        });
    }
    // Define a function to handle the selection of image files
    const handleImage = (e) => {

        // Create a FileReader object
        const reader = new FileReader();

        const file = e.target.files[0]
        // Read the file as a data URL
        reader.readAsDataURL(file);

        // When the reading is complete, add the data URL to the 'images' state array
        reader.onloadend = () => {
            setFormValues(oldArray => {
                return {
                    ...oldArray, image: reader.result
                }
            });
        }
    }

    return (
        loading ?
            <Loader />
            :
            <>
                <div className="form-container">
                    <div id="FormContainer">
                        <div className="ImgContainer">
                        </div>
                        <form id="Form">
                            <h1 id="FormHeading">Edit Profile</h1>
                            <div className="Name">
                                <li><label>Full Name:</label>
                                    <input type="text" name='name' value={formValues.name} onChange={HandleChange} placeholder="Enter your Fullname" />
                                    <Alert label={'name'} errors={err} />
                                </li>
                                <li><label>Phone No:</label>
                                    <input type="text" name='phone' value={formValues.phone} onChange={HandleChange} placeholder="Enter your phone" />
                                    <Alert label={'phone'} errors={err} />
                                </li>
                            </div>
                            <li>
                                <label>Email:</label>
                                <input type="email" name='email' value={formValues.email} onChange={HandleChange} placeholder="Enter your email" />
                                <Alert label={'email'} errors={err} />
                            </li>
                            <div className="Name">
                                <li><label>City:</label>
                                    <input type="text" name='city' value={formValues.city} onChange={HandleChange} placeholder="Enter your city" />
                                    <Alert label={'city'} errors={err} />
                                </li>
                                <li><label>State:</label>
                                    <input type="text" name='state' value={formValues.state} onChange={HandleChange} placeholder="Entr your state" />
                                    <Alert label={'state'} errors={err} />
                                </li>
                            </div>
                            <div className="Name">
                                <li>
                                    <label>Country:</label>
                                    <select name='country'value={formValues.country} onChange={HandleChange}>
                                        <option>Afghanistan</option>
                                        <option>India</option>
                                        <option>Albania</option>
                                        <option>Algeria</option>
                                        <option>Andorra</option>
                                        <option>Angola</option>
                                        <option>Argentina</option>
                                        <option>Armenia</option>
                                        <option>Australia</option>
                                        <option>Austria</option>
                                        <option>Azerbaijan</option>
                                        <option>Croatia</option>
                                    </select >
                                    <Alert label={'country'} errors={err} />
                                </li>
                                <li>
                                    <label>Pincode No:</label>
                                    <input type="text" name='pincode' value={formValues.pincode} onChange={HandleChange} placeholder="Enter your pincode" />
                                    <Alert label={'pincode'} errors={err} />
                                </li>
                            </div>
                            <div className="password">
                                <li><label>Password:</label>
                                    <input type="password" name='password' onChange={HandleChange} />
                                    <Alert label={'password'} errors={err} />
                                </li>
                                <li>
                                    <label>Confirm Password:</label>
                                    <input type="password" name='confirmPassword' onChange={HandleChange} />
                                    <Alert label={'confirmPassword'} errors={err} />
                                </li>
                            </div>
                            <li><label>Images:</label>
                                <input type="file" name='images' onChange={handleImage} placeholder="select 4 images" />
                                <Alert label={'images'} errors={err} />
                            </li>
                            <button onClick={e => HandleSignup(e)} >Update</button>
                        </form>
                    </div>
                </div>
            </>
    )
}

export default EditAdminProfile

