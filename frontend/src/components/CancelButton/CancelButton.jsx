import React, { useState } from 'react';

const CancelButton = ({ status, HandelCancelRequest, vehicle }) => {
  const [disabled, setDisabled] = useState(false);
  let color;
  if (status == 'CANCELLED') {
    color = '#D3D3D3'
    setDisabled(true)
  } else {
    color = '#FF9494'
  }
  const StatusSyle = {
    backgroundColor: color
  }
  return (
    <button className='cancel-btn' disabled={disabled} onClick={() => HandelCancelRequest(vehicle._id)} style={StatusSyle}>{status ? status + "..." : "CANCEL"} </button>
  )
}

export default CancelButton
