import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const SortByStatus = ({ setVehicles }) => {
    // Destructure the 'data' property from the 'bookedDetails' state using useSelector.
    const { data } = useSelector(state => state.bookedDetails);

    // Initialize a 'status' state variable with the default value 'default'.
    const [status, setStatus] = useState('default');


    // This function handles changes in the sorting status.
    const handleSortChange = (e) => {
        // Update the status state with the selected value.
        setStatus(e.target.value);

        // Sort the vehicles based on the selected status.
        sortVehicles(e.target.value);
    };

    // This function sorts the vehicles based on their status.
    const sortVehicles = (status) => {
        let sorted;

        // Call the sortByStatus function to sort the vehicles.
        sorted = sortByStatus(status);

        // Update the vehicles state with the sorted array.
        setVehicles(sorted);
    };


    // This function sorts vehicles based on their booking status.

    const sortByStatus = (status) => {
        // If the status is 'default', return the unsorted data as is.
        if (status === 'default') {
            return data;
        } else {
            // Create a new array 'sortedVehicles' containing vehicles with matching booking status.
            const sortedVehicles = data.filter((value) => {
                // Check if the booking status of the vehicle matches the selected status.
                if (value.bookingDetails.booking_status === status) {
                    // If it matches, include the vehicle in the sorted list.
                    return value;
                }
            });

            // Return the sorted list of vehicles.
            return sortedVehicles;
        }
    }
    
    return (
        <select id="sortDropdown" value={status} onChange={handleSortChange}>
            <option value="default">Default</option>
            <option value="PENDING">PENDING</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="REJECTED">REJECTED</option>
        </select>
    )
}

export default SortByStatus
