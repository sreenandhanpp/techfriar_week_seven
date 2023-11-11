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
import AdminProfile from './pages/AdminProfile/AdminProfile';
import EditAdminProfile from './pages/EditAdminProfile/EditAdminProfile';
import AllBookingDetails from './pages/AllBookingDetails/AllBookingDetails';
import { getItem } from '../localStorage/getItem';
import AdminRoute from './components/AdminRoute/AdminRoute';
import { useEffect, useState } from 'react';
import UserRoute from './components/UserRoute/UserRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';


function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Fetch user details from wherever you store them (e.g., localStorage)
    const storedUser = getItem('user');
    setUser(storedUser);
  }, []);
  return (
    <>
      <Routes>

        {/* Admin Routes */}

        <Route exact path='/all-booking-details' element={<AdminRoute />}>
          <Route exact path='/all-booking-details' element={<AllBookingDetails />} />
        </Route>

        <Route exact path='/edit-admin-profile' element={<AdminRoute />}>
          <Route exact path='/edit-admin-profile' element={<EditAdminProfile />} />
        </Route>

        <Route exact path='/admin-profile' element={<AdminRoute />}>
          <Route exact path='/admin-profile' element={<AdminProfile />} />
        </Route>

        <Route exact path='/update-products/:id' element={<AdminRoute />}>
          <Route exact path='/update-products/:id' element={<UpdateProduct />} />
        </Route>

        <Route exact path='/dashboard' element={<AdminRoute />}>
          <Route exact path='/dashboard' element={<AdminDashboard />} />
        </Route>

        <Route exact path='/create-products' element={<AdminRoute />}>
          <Route exact path='/create-products' element={<CreateProducts />} />
        </Route>

        {/* User Routes */}

        <Route exact path='/booked-details' element={<UserRoute />} >
          <Route exact path='/booked-details' element={<BookedDetails />} />
        </Route>

        <Route exact path='/payment/success' element={<UserRoute />} >
          <Route exact path='/payment/success' element={<PaymentSuccess />} />
        </Route>

        <Route exact path='/payment/failed' element={<UserRoute />} >
          <Route exact path='/payment/failed' element={<PaymentFailed />} />
        </Route>

        <Route exact path='/product-details/:id' element={<UserRoute />} >
          <Route exact path='/product-details/:id' element={<ProductDetails />} />
        </Route>

        <Route exact path='/' element={<UserRoute />} >
          <Route exact path='/' element={<Home />} />
        </Route>

        <Route exact path='/signup' element={<PublicRoute />} >
          <Route exact path='/signup' element={<Signup />} />
        </Route>

        <Route exact path='/login' element={<PublicRoute />} >
          <Route exact path='/login' element={<Login />} />
        </Route>

        <Route exact path='/send-email' element={<SendEmailOtp />} />
        <Route exact path='/send-phone' element={<SendPhoneOtp />} />
        <Route exact path='/verify-email' element={<VerifyEmail />} />
        <Route exact path='/verify-phone' element={<VerifyPhone />} />

      </Routes>
    </>
  )
}

export default App
