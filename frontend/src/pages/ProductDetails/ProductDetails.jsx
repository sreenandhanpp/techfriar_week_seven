import React, { useEffect, useState } from 'react';
import './style.css'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { URL } from '../../utils/url';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ADMIN } from '../../redux/constants/admin';
import Loader from '../../components/Loader/Loader';
import { getItem } from '../../../localStorage/getItem';
import BookNow from '../../components/BookNow/BookNow';
import { toast } from 'react-toastify';


const ProductDetails = () => {

    // Get access to the 'dispatch' function from Redux (with an empty string action type)
    const dispatch = useDispatch('');

    // Extract the 'id' parameter from the current route using 'useParams' from React Router
    const { id } = useParams();

    // Retrieve user data, presumably from local storage or a similar mechanism
    const userData = getItem('user');


    // Extract 'loading' and 'data' properties from the 'product' slice of Redux state
    const { loading, data } = useSelector(state => state.product);

    // Set up an effect to fetch a product's details when the component mounts
    useEffect(() => {
        // Dispatch an action to request fetching a product
        dispatch({ type: ADMIN.FETCH_PRODUCT_REQUEST });

        // Make an HTTP POST request to retrieve product details by 'id'
        axios.post(URL + '/common/api/get-product', {
            id
        }).then(res => {
            console.log(res);

            // Dispatch a success action with the fetched product data
            dispatch({ type: ADMIN.FETCH_PRODUCT_SUCCESS, payload: res.data });

            // Update component state with the fetched product details
            if (res) {
                setName(res.data.name);
                setPrice(res.data.price);
                setQuantity(res.data.quantity);
                setModel(res.data.model);
                setManufacturer(res.data.manufacturer);
                setDescription(res.data.description);
                setImages(res.data.images);
            }
        }).catch(err => {
            // Dispatch a failure action in case of an error
            dispatch({ type: ADMIN.FETCH_PRODUCT_FAILED, error: "error" });
        });
    }, []); // This effect runs only once upon component mounting


    return (
        loading ?
            <Loader />
            :
            data.images ?
                <div>
                    <div className="card-wrapper">
                        <div className="card">
                            <div className="product-imgs">
                                <div className="img-display">
                                    <div className="img-showcase">
                                        <img src={data.images[0].url} alt='Vehicle image' />
                                        <img src={data.images[1].url} alt='Vehicle image' />
                                        <img src={data.images[2].url} alt='Vehicle image' />
                                        <img src={data.images[3].url} alt='Vehicle image' />
                                    </div>
                                </div>
                                <div className="img-select">
                                    <div className="img-item">
                                        <Link href="#" data-id="1">
                                            <img src={data.images[0].url} alt='Vehicle image' />
                                        </Link>
                                    </div>
                                    <div className="img-item">
                                        <Link href="#" data-id="2">
                                            <img src={data.images[1].url} alt='Vehicle image' />
                                        </Link>
                                    </div>
                                    <div className="img-item">
                                        <Link href="#" data-id="3">
                                            <img src={data.images[2].url} alt='Vehicle image' />
                                        </Link>
                                    </div>
                                    <div className="img-item">
                                        <Link href="#" data-id="4">
                                            <img src={data.images[3].url} alt='Vehicle image' />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="product-content">
                                <h2 className="product-title">{data.name} </h2>
                                <div className="product-price">
                                    <h3 className="new-price"> Price: <span>${data.price} </span></h3>
                                </div>
                                <div className="product-detail">
                                    <h2>about this item: </h2>
                                    <p> {data.description} </p>
                                </div>
                                <div className="purchase-info">
                                    <button className="btn">
                                        <BookNow />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                : <div>Not found</div>

    )
}

export default ProductDetails