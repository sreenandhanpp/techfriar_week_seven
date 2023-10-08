import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const PaymentFailed = () => {
  // Access the 'navigate' function from React Router
  const navigate = useNavigate();

  // Use a 'useEffect' hook to navigate to the home page and display a success message
  useEffect(() => {
    // Navigate to the home page ('/')
    navigate('/');

    // Display a success message using a toast notification
    toast.success("Vehicle Booked failed", {
      position: toast.POSITION.BOTTOM_CENTER
    });
  })

  return (
    <div></div>
  )
}

export default PaymentFailed