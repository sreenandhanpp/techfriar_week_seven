import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { ADMIN } from '../../redux/constants/admin';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loador from '../../components/Loader/Loader';
import { URL } from '../../utils/url';
import './style.css'
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    // Get the 'dispatch' function to send actions to Redux store
    const dispatch = useDispatch();

    // Extract 'loading' and 'data' properties from the Redux store
    const { loading, data } = useSelector(state => state.products);

    // 'loading' indicates if an asynchronous operation is in progress
    // 'data' stores product-related information from the Redux store

    // Set up an effect to fetch product data when the component mounts
    useEffect(() => {
        try {
            // Dispatch an action to request fetching products
            dispatch({ type: ADMIN.FETCH_PRODUCTS_REQUEST });

            // Make an HTTP GET request to retrieve product data
            axios.get(URL + '/common/api/all-product').then(res => {
                if (res.status === 200) {
                    // If the request is successful, dispatch a success action with the fetched data
                    dispatch({ type: ADMIN.FETCH_PRODUCTS_SUCCESS, payload: res.data });
                } else {
                    // If there's an error in the request, dispatch a failure action with the error details
                    dispatch({ type: ADMIN.FETCH_PRODUCTS_FAILED, error: res.error });
                }
            });
        } catch (err) {
            // If an unexpected error occurs, dispatch a failure action with a generic error message
            dispatch({ type: ADMIN.FETCH_PRODUCTS_FAILED, error: "error" });
        }
    }, []); // This effect runs only once upon component mounting

    // Define a function to handle the deletion of a product by ID
    const HandleDelete = (id) => {
        try {
            // Dispatch an action to indicate the start of the product deletion process
            dispatch({ type: ADMIN.DELETE_PRODUCT_REQUEST });

            // Make an HTTP POST request to the server to delete the product with the given ID
            axios.post(URL + '/admin/api/delete-product', {
                id
            }).then(res => {
                if (res.status === 200) {
                    // If the deletion is successful, dispatch a success action
                    dispatch({ type: ADMIN.DELETE_PRODUCT_SUCCESS });

                    // Display a success message using a toast notification
                    toast.success("Vehicle Deleted", {
                        position: toast.POSITION.BOTTOM_CENTER
                    });

                    // Reload the page to reflect the changes (if needed)
                    location.reload();
                } else {
                    // If the deletion is not successful, dispatch a failure action
                    dispatch({ type: ADMIN.DELETE_PRODUCT_FAILED });
                }
            });
        } catch (error) {
            // If an error occurs during the deletion process, dispatch a failure action
            dispatch({ type: ADMIN.DELETE_PRODUCT_FAILED });
        }
    }

    return (
        loading ? <Loador />
            :
            <div>
                <Navbar />
                <div>
                    <div className='product-head'>
                        <h2>PRODUCTS</h2>
                        <button><Link to={'/create-products'}> create</Link> </button>
                    </div>
                    <div className="section__container">
                        <div className="musthave__grid">

                            {
                                data.map((product) => {
                                    return (
                                        <div key={product._id} className="musthave__card">
                                            <img src={product.images[0].url} alt="must have" />
                                            <h4>{product.name}</h4>
                                            <b>{product.price} </b>
                                            <div className="buttons">
                                                <Link to={`/update-products/${product._id}`} >
                                                    <button className="action-buttons">update</button>
                                                </Link>
                                                <button className="action-buttons" onClick={() => HandleDelete(product._id)}>Delete</button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default AdminDashboard
