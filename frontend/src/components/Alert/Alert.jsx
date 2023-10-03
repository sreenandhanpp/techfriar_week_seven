import React from 'react'
import './style.css'

const Alert = ({ msg }) => {
  return (
    <p className='alert'> {msg} </p>
  )
}

export default Alert