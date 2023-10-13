import React from 'react';
import './style.css';

const PaymentStatusBtn = ({ status }) => {
  let color;
  if (status) {
    color = '#4BB543'
  } else {
    color = '#FF9494'
  }
  const StatusSyle = {
    backgroundColor: color
  }
  return (
    <button className='payment-status-btn' style={StatusSyle}> SUCCESS </button>
  )
}

export default PaymentStatusBtn
