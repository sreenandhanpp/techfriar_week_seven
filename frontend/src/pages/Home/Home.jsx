import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../../components/Navbar/Navbar';
import './style.css'
import { USER } from '../../redux/constants/user';
import axios from 'axios';
import { ADMIN } from '../../redux/constants/admin';
import { Link } from 'react-router-dom';
import { URL } from '../../utils/url';
import BookNow from '../../components/BookNow/BookNow';
import Loader from '../../components/Loader/Loader';

const Home = () => {
    const [searchText, setSearchText] = useState('');
    const [product, setProduct] = useState([]);

    // Access Redux store state and dispatch function
    const dispatch = useDispatch();

    // Extract loading and data properties from the Redux store
    const { loading, data } = useSelector(state => state.products);

    // Use the useEffect hook to fetch products data when the component mounts
    useEffect(() => {
        try {
            // Dispatch a FETCH_PRODUCTS_REQUEST action to indicate that product fetching has started
            dispatch({ type: ADMIN.FETCH_PRODUCTS_REQUEST });

            // Send a GET request to the server API to fetch products data
            axios.get(URL + '/common/api/all-product').then(res => {
                if (res.status === 200) {
                    // Dispatch a FETCH_PRODUCTS_SUCCESS action with the fetched data
                    dispatch({ type: ADMIN.FETCH_PRODUCTS_SUCCESS, payload: res.data });
                    setProduct(res.data);
                } else {
                    // Dispatch a FETCH_PRODUCTS_FAILED action with an error message
                    dispatch({ type: ADMIN.FETCH_PRODUCTS_FAILED, error: res.error });
                }
            });
        } catch (err) {
            // Dispatch a FETCH_PRODUCTS_FAILED action with a generic error message
            dispatch({ type: ADMIN.FETCH_PRODUCTS_FAILED, error: "error" });
        }
    }, []); // The empty dependency array indicates that this effect runs once when the component mounts


    // Define a function to handle product search based on user input
    const HandleSearch = (event) => {
        // Update the 'searchText' state with the user's input
        setSearchText(event.target.value);

        // Filter products based on the search text
        const filteredProducts = data.filter((product) => {
            const { name, model, manufacturer } = product;
            const lowerSearchText = searchText.toLowerCase();

            // Check if product properties contain the lowercased search text
            return (
                name.toLowerCase().includes(lowerSearchText) ||
                model.toLowerCase().includes(lowerSearchText) ||
                manufacturer.toLowerCase().includes(lowerSearchText)
            );
        });

        // If there are filtered products, update the displayed products; otherwise, show all products
        if (filteredProducts.length > 0) {
            setProduct(filteredProducts);
        } else {
            setProduct(data);
        }
    };

    return (
        loading ?
            <Loader />
            :
            <>
                <Navbar />
                <section className="section__container musthave__container">
                    <div className="musthave__nav">
                        <h1 className="section__title">Vehicles</h1>
                        <input type='text' onChange={HandleSearch} />

                    </div>
                    <div className="musthave__grid">
                        {
                            product.map((product) => {
                                return (
                                    <Link key={product._id} to={`/product-details/${product._id}`}>
                                        <div className="container">
                                            <div className="products">
                                                <div className="product">
                                                    <img src={product.images[0].url} width="250px" height="250px" alt="" />
                                                    <div className="content">
                                                        <h3><Link >{product.name} </Link></h3>
                                                        <span><Link >₹{product.price} </Link></span>
                                                    </div>
                                                    <div className="link">
                                                        <Link><BookNow /></Link>
                                                        <Link>Add to Cart</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </section>
            </>
    )
}

export default Home
