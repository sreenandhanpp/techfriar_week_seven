import React from 'react'
import './style.css'

const Alert = ({ errors, label }) => {
  return (
    errors &&
    errors.map(value => {
      if (value.path == label) {
        return <div key={value.msg}><p className='alert'> *{value.msg} </p></div>
      }
    })
  )
}

export default Alert