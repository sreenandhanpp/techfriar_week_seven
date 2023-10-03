import React from 'react'
import './style.css'


const SendOtp = ({ msg, HandleAction, color }) => {

    const msgStyle = {
        color:color
    }
    return (
        <div className='otp-container'>
            <form className="otp-Form">
                <span className="mainHeading">SEND OTP</span>
                <p className="otpSubheading" style={msgStyle}>{msg}</p>
                <button className="verifyButton" onClick={HandleAction}>Send</button>
            </form>
        </div>
    )
}

export default SendOtp