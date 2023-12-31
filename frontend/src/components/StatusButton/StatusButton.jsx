import React from 'react';
import './style.css';

const StatusButton = ({ status }) => {
    let color ;
    if(status == 'PENDING'){
        color= '#D3D3D3'
    }else if(status == 'SUCCESS'){
        color ='#4BB543'
    }else{
        color = '#FF9494'
    }
    const StatusSyle = {
        color: color
    }
  return (
    <p className='status-btn' style={StatusSyle}>{status} </p>
  )
}

export default StatusButton
