import React from 'react'

const Verfy = ({ color,msg,HandleChange,HandleResend,HandleVerify }) => {

    const msgStyle = {
        color:color
    }

    return (
        <div className='otp-container'>
            <form className="otp-Form">
                <span className="mainHeading">Enter OTP</span>
                <p className="otpSubheading" style={msgStyle}> { msg } </p>
                <div className="inputContainer">
                    <input onChange={HandleChange} name='digitOne' required="required" maxLength="1" type="text" className="otp-input" id="otp-input1" />
                    <input onChange={HandleChange} name='digitTwo' required="required" maxLength="1" type="text" className="otp-input" id="otp-input2" />
                    <input onChange={HandleChange} name='digitThree' required="required" maxLength="1" type="text" className="otp-input" id="otp-input3" />
                    <input onChange={HandleChange} name='digitFour' required="required" maxLength="1" type="text" className="otp-input" id="otp-input4" />
                </div>
                <button className="verifyButton" type="submit" onClick={(e) => HandleVerify(e)}>Verify</button>
                <p className="resendNote">Didn't receive the code? <button className="resendBtn" onClick={(e) => HandleResend(e)}>Resend Code</button></p>
            </form>
        </div>
    )
}

export default Verfy