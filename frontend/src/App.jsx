import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import VerifyPhone from './pages/VerifyPhone/VerifyPhone';
import Signup from './pages/Signup/Signup';
import SendEmailOtp from './pages/SendEmailOtp/SendEmailOtp';
import SendPhoneOtp from './pages/SendPhoneOtp/SendPhoneOtp';
import Login from './pages/Login/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreateProducts from './pages/CreateProduct/CreateProduct';
import UpdateProduct from './pages/UpdateProduct/UpdateProduct';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed/PaymentFailed';
import BookedDetails from './pages/BookedDetails/BookedDetails';



function App() {
  return (
    <>
      <Routes>
        <Route exact path='/send-email' element={<SendEmailOtp />} />
        <Route exact path='/send-phone' element={<SendPhoneOtp />} />
        <Route exact path='/verify-email' element={<VerifyEmail />} />
        <Route exact path='/verify-phone' element={<VerifyPhone />} />
        <Route exact path='/signup' element={<Signup />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/' element={<Home />} />
        <Route exact path='/booked-details' element={<BookedDetails />} />
        <Route exact path='/payment/success' element={<PaymentSuccess />} />
        <Route exact path='/payment/failed' element={<PaymentFailed />} />
        <Route exact path='/product-details/:id' element={<ProductDetails />} />
        <Route exact path='/update-products/:id' element={<UpdateProduct />} />
        <Route exact path='/admin' element={<AdminDashboard />} />
        <Route exact path='/create-products' element={<CreateProducts />} />
      </Routes>
    </>
  )
}

export default App
