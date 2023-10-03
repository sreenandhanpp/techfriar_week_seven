import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PincodeInput from '../../components/PincodeInput/PincodeInput';
import Navbar from '../../components/Navbar/Navbar';
import './style.css'
import { USER } from '../../redux/constants/user';
import axios from 'axios';

const Home = () => {
    const dispatch = useDispatch();
    const [pincode, setPincode] = useState('');
    const [err, setErr] = useState('');
    const [city, setCity] = useState('');
    const [dist, setDist] = useState('');
    const [state, setState] = useState('');
    const [region, setRegion] = useState('');

    const { loading, error, data } = useSelector(state => state.pincodeData);

    // Handle the user's request to fetch location details based on a PIN code.
    const HandleFetch = (e) => {
        // Define a regular expression to validate the PIN code format (6 digits)
        let reg = new RegExp("^[1-9][0-9]{5}$");

        if (pincode === "") {
            // Set an error message if the PIN code field is empty
            setErr("Fill the pincode field");
        } else if (!reg.test(pincode)) {
            // Set an error message if the PIN code format is incorrect
            setErr("Incorrect Pincode");
        } else {
            // Dispatch an action to indicate the PIN details fetch request is in progress
            dispatch({ type: USER.FETCH_PIN_DETAILS_REQUEST });

            // Send a GET request to the API to fetch location details based on the PIN code
            axios.get(`https://api.postalpincode.in/pincode/${pincode}`).then(res => {
                if (res.data[0].PostOffice) {
                    // Extract relevant location data from the API response
                    let data = res.data[0].PostOffice[0];

                    // Update state variables with location details
                    setDist(data.District);
                    setState(data.State);
                    setCity(data.Block);
                    setRegion(data.Region);

                    // Dispatch an action to indicate a successful PIN details fetch
                    dispatch({ type: USER.FETCH_PIN_DETAILS_SUCCESS, payload: data });
                } else {
                    // Throw an error if no records are found
                    throw "No Records Found";
                }
            }).catch(err => {
                // Set an error message and dispatch an action for a failed fetch
                setErr(err);
                dispatch({ type: USER.FETCH_PIN_DETAILS_FAILED, error: err });
            });
        }
    }
    return (
        <>
            <Navbar />
            <div className='home-wrapper'>
                <PincodeInput HandleFetch={HandleFetch} setPincode={setPincode} />
                {
                    err ?
                        <div className='pincode-wrapper'>
                            <div className="card">
                                <p className="card-title"> </p>
                                <p className="card-des2">
                                    {err}
                                </p>
                            </div>
                        </div>
                        : data && <div className='pincode-wrapper'>
                            <div className="card">
                                <p className="card-title">Pincode Detals</p>
                                <p className="card-des">
                                    {city},{dist},{region},{state}
                                </p>
                            </div>
                        </div>
                }
            </div>
        </>
    )
}

export default Home
