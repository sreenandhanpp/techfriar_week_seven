import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { URL } from '../../utils/url';
import { USER } from '../../redux/constants/user';
import './style.css';
import Loader from '../../components/Loader/Loader';
import { toast } from 'react-toastify';
import Alert from '../../components/Alert/Alert';
import { ADMIN } from '../../redux/constants/admin';


const CreateProducts = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [model, setModel] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [images, setImages] = useState([]);
    const [err, setErr] = useState([]);
    const navigate = useNavigate();

    // Get access to the Redux 'dispatch' function
    const dispatch = useDispatch();

    //Get global state of userData using useSelector
    const { loading } = useSelector(state => state.userData);


    // Define a function to handle the selection of image files
    const handleImage = (e) => {
        // Convert the selected files to an array
        const files = Array.from(e.target.files);

        // Iterate through each selected file
        files.forEach(file => {
            // Create a FileReader object
            const reader = new FileReader();

            // Read the file as a data URL
            reader.readAsDataURL(file);

            // When the reading is complete, add the data URL to the 'images' state array
            reader.onloadend = () => {
                setImages(oldArray => [...oldArray, reader.result]);
            }
        })
    }


    // Define a function to handle the form submission
    const HandleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Try to create a new product
        try {
            // Dispatch an action to indicate the start of the product creation process
            dispatch({ type: ADMIN.CREATE_PRODUCT_REQUEST });

            // Make an HTTP POST request to create a new product
            axios.post(URL + '/admin/api/create-product', {
                name: name,
                images: images,
                manufacturer: manufacturer,
                model: model,
                quantity: quantity,
                description: description,
                price: price
            }).then(res => {
                console.log(res);
                if (res.status === 200) {
                    // If the creation is successful, dispatch a success action
                    dispatch({ type: ADMIN.CREATE_PRODUCT_SUCCESS });

                    // Navigate to '/verify-email' route
                    navigate('/verify-email');

                    // Display a success message using a toast notification
                    toast.success(res.data.message, {
                        position: toast.POSITION.BOTTOM_CENTER
                    });

                    // Navigate to '/admin' route with replacement (redirect) 
                    navigate('/admin', { replace: true });
                }
            }).catch(err => {
                if (err) {
                    // Set an error message if there's an error response
                    setErr(err.response.data.error);
                }

                // Dispatch a failure action with the error payload
                dispatch({ type: ADMIN.CREATE_PRODUCT_FAILED, payload: err });
            })
        } catch (err) {
            // Dispatch a failure action if an error occurs during the creation process
            dispatch({ type: ADMIN.CREATE_PRODUCT_FAILED, payload: err });
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
                            <h1 id="FormHeading">Sign Up</h1>
                            <div className="Name">
                                <li><label>Name:</label>
                                    <input type="text" name='name' onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
                                    <Alert label={'name'} errors={err} />
                                </li>
                                <li><label>Model:</label>
                                    <input type="text" name='model' onChange={(e) => setModel(e.target.value)} placeholder="Enter vehicle model" />
                                    <Alert label={'model'} errors={err} />
                                </li>
                            </div>
                            <li>
                                <label>Description:</label>
                                <textarea type="text" className='textarea' name='description' onChange={(e) => setDescription(e.target.value)} placeholder="Enter vehicle description" />
                                <Alert label={'description'} errors={err} />
                            </li>
                            <div className="Name">
                                <li><label>Manufacturer:</label>
                                    <input type="text" name='manufacturer' onChange={(e) => setManufacturer(e.target.value)} placeholder="Enter manufaturer" />
                                    <Alert label={'manufacturer'} errors={err} />
                                </li>
                                <li><label>Quantity:</label>
                                    <input type="number" name='quantity' onChange={(e) => setQuantity(e.target.value)} placeholder="Enter quantity" />
                                    <Alert label={'quantity'} errors={err} />
                                </li>
                            </div>
                            <div className="Name">
                                <li><label>Price:</label>
                                    <input type="number" name='price' onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" />
                                    <Alert label={'price'} errors={err} />
                                </li>
                                <li><label>Images:</label>
                                    <input type="file" multiple name='images' onChange={handleImage} placeholder="select 4 images" />
                                    <Alert label={'images'} errors={err} />
                                </li>
                            </div>
                            <button onClick={e => HandleSubmit(e)} >Sign Up</button>
                        </form>
                    </div>
                </div>
            </>
    )
}

export default CreateProducts

