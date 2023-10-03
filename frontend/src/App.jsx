import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import VerifyPhone from './pages/VerifyPhone/VerifyPhone';
import VerifyAadhar from './pages/VerifyAadhar/VerifyAadhar';
import Signup from './pages/Signup/Signup';
import SendEmailOtp from './pages/SendEmailOtp/SendEmailOtp';
import SendPhoneOtp from './pages/SendPhoneOtp/SendPhoneOtp';
import { EmailAuth } from './components/EmailAuth/EmailAuth';
import { PhoneAuth } from './components/PhoneAuth/PhoneAuth';
import { VerifyEmailAuth } from './components/VerifyEmalAuth/VerifyEmailAuth';
import { VerifyPhoneAuth } from './components/VerifyPhoneAuth/VerifyPhoneAuth';
import { VerifyAadharAuth } from './components/VerifyAadharAuth/VerifyAadharAuth';
import { HomeAuth } from './components/HomeAuth/HomeAuth';



function App() {
  return (
    <>
      <Routes>
        <Route exact path='/send-email' element={<EmailAuth> <SendEmailOtp /> </EmailAuth>} />
        <Route exact path='/send-phone' element={<PhoneAuth> <SendPhoneOtp /> </PhoneAuth>} />
        <Route exact path='/verify-email' element={<VerifyEmailAuth> <VerifyEmail /> </VerifyEmailAuth>} />
        <Route exact path='/verify-phone' element={<VerifyPhoneAuth>  <VerifyPhone /> </VerifyPhoneAuth>} />
        <Route exact path='/verify-aadhar' element={<VerifyAadharAuth>  <VerifyAadhar /> </VerifyAadharAuth>} />
        <Route exact path='/signup' element={<Signup />} />
        <Route exact path='/' element={<HomeAuth>  <Home /> </HomeAuth>} />
      </Routes>
    </>
  )
}

export default App
