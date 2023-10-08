import React, { useEffect } from 'react'
import { getItem } from '../../../localStorage/getItem';
import axios from 'axios';
import { URL } from '../../utils/url';

const BookedDetails = () => {
    const userData = getItem('user');

    useEffect(() => {
        // dispatch({ type: ADMIN.FETCH_PRODUCT_REQUEST });
        axios.post(URL + '/user/api/get-booked-products', {
            id: userData.id
        }).then(res => {
        }).catch(err => {
            console.log(err)
            dispatch({ type: ADMIN.FETCH_PRODUCT_FAILED, error: "error" });
        });
    }, []);
    return (
        <div>

        </div>
    )
}

export default BookedDetails