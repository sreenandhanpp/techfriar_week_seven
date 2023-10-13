import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../../components/Navbar/Navbar';
import './style.css'
import axios from 'axios';
import { ADMIN } from '../../redux/constants/admin';
import { Link } from 'react-router-dom';
import { URL } from '../../utils/url';
import BookNow from '../../components/BookNow/BookNow';
import Loader from '../../components/Loader/Loader';

const Home = () => {
    const [searchText, setSearchText] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [sortOrder, setSortOrder] = useState('default');
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
                    setVehicles(res.data);
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
    useEffect(() => {
        const filteredData = data.filter((vehicle) => {
            return searchText.toLowerCase() === ''
                ? vehicle
                : (
                    vehicle.name.toLowerCase().includes(searchText) ||
                    vehicle.model.toLowerCase().includes(searchText) ||
                    vehicle.manufacturer.toLowerCase().includes(searchText)
                )
        })
        if (filteredData.length > 0) {
            setVehicles(filteredData);
        } else {
            setVehicles(null);
        }
    }, [searchText]);

    const handleSortChange = (event) => {
        const selectedOrder = event.target.value;
        setSortOrder(selectedOrder);
        sortProducts(selectedOrder);
    };

    const sortProducts = (order) => {
        const sorted = [...data];
        if (order === 'highToLow') {
            sorted.sort((a, b) => b.price - a.price);
        } else if (order === 'lowToHigh') {
            sorted.sort((a, b) => a.price - b.price);
        }
        setVehicles(sorted);
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
                        <input type='text' onChange={e => setSearchText(e.target.value)} />
                        <select id="sortDropdown" value={sortOrder} onChange={handleSortChange}>
                            <option value="default">Default</option>
                            <option value="highToLow">High to Low</option>
                            <option value="lowToHigh">Low to High</option>
                        </select>
                    </div>
                    <div className="musthave__grid">
                        {
                            vehicles ?
                                vehicles.map((vehicle) => {
                                    return (
                                        <Link key={vehicle._id} to={`/product-details/${vehicle._id}`}>
                                            <div className="container">
                                                <div className="products">
                                                    <div className="product">
                                                        <img src={vehicle.images[0].url} width="250px" height="250px" alt="" />
                                                        <div className="content">
                                                            <h3><Link >{vehicle.name} </Link></h3>
                                                            <span><Link >₹{vehicle.price} </Link></span>
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
                                : <h3>not found</h3>
                        }
                    </div>
                </section>
            </>
    )
}

export default Home
