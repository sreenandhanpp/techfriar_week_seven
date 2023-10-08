import axios from 'axios';
import React, { useDebugValue, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ADMIN } from '../../redux/constants/admin';
import { useDispatch } from 'react-redux';
import Alert from '../../components/Alert/Alert';
import { URL } from '../../utils/url';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [model, setModel] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [images, setImages] = useState([]);
    const { id } = useParams();
    const [err, setErr] = useState([]);


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

    // Set up an effect to fetch a product's details when the component mounts
    useEffect(() => {
        // Make an HTTP POST request to retrieve product details by 'id'
        axios.post(URL + '/common/api/get-product', {
            id
        }).then(res => {
            // Update component state with the fetched product details
            setName(res.data.name);
            setPrice(res.data.price);
            setQuantity(res.data.quantity);
            setModel(res.data.model);
            setManufacturer(res.data.manufacturer);
            setDescription(res.data.description);
        });
    }, []); // This effect runs only once upon component mounting

    // Define an asynchronous function to handle the form submission for updating a product
    const HandleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        console.log("submit");

        // Try to initiate the product update process
        try {
            // Dispatch an action to request updating a product
            dispatch({ type: ADMIN.FETCH_PRODUCT_REQUEST });

            // Make an HTTP POST request to update the product with the provided data
            axios.post(URL + '/admin/api/update-product', {
                id,
                name,
                model,
                price,
                manufacturer,
                description,
                quantity,
                images: images
            }).then(res => {
                if (res.status === 200) {
                    // If the update is successful, dispatch a success action
                    dispatch({ type: ADMIN.FETCH_PRODUCT_SUCCESS, payload: res.data });

                    // Display a success message using a toast notification
                    toast.success("Vehicle updated", {
                        position: toast.POSITION.BOTTOM_CENTER
                    });

                    // Navigate to the '/admin' route with replacement (redirect)
                    navigate('/admin', { replace: true });
                }
            }).catch(err => {
                // Set an error message if there's an error response
                setErr(err.response.data.error);
            });
        } catch (err) {
            // Dispatch a failure action if an error occurs during the update process
            dispatch({ type: ADMIN.FETCH_PRODUCT_FAILED, payload: "error" });
        }
    }

    return (
        <div className="form-container">
            <div id="FormContainer">
                <div className="ImgContainer">
                </div>
                <form id="Form">
                    <h1 id="FormHeading">Update Vehicle</h1>
                    <div className="Name">
                        <li><label>Name:</label>
                            <input type="text" name='name' onChange={(e) => setName(e.target.value)} placeholder="Enter name" value={name} />
                            <Alert label={'name'} errors={err} />
                        </li>
                        <li><label>Model:</label>
                            <input type="text" name='model' onChange={(e) => setModel(e.target.value)} placeholder="Enter vehicle model" value={model} />
                            <Alert label={'model'} errors={err} />
                        </li>
                    </div>
                    <li>
                        <label>Description:</label>
                        <textarea type="text" className='textarea' name='description' onChange={(e) => setDescription(e.target.value)} placeholder="Enter vehicle description" value={description} />
                        <Alert label={'description'} errors={err} />
                    </li>
                    <div className="Name">
                        <li><label>Manufacturer:</label>
                            <input type="text" name='manufacturer' onChange={(e) => setManufacturer(e.target.value)} placeholder="Enter manufaturer" value={manufacturer} />
                            <Alert label={'manufacturer'} errors={err} />
                        </li>
                        <li><label>Quantity:</label>
                            <input type="number" name='quantity' onChange={(e) => setQuantity(e.target.value)} placeholder="Enter quantity" value={quantity} />
                            <Alert label={'quantity'} errors={err} />
                        </li>
                    </div>
                    <div className="Name">
                        <li><label>Price:</label>
                            <input type="number" name='price' onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" value={price} />
                            <Alert label={'price'} errors={err} />
                        </li>
                        <li><label>Images:</label>
                            <input type="file" multiple name='images' onChange={handleImage} placeholder="select 4 images" />
                            <Alert label={'images'} errors={err} />
                        </li>
                    </div>
                    <button onClick={e => HandleSubmit(e)} >Update</button>
                </form>
            </div>
        </div>
    )
}

export default UpdateProduct
