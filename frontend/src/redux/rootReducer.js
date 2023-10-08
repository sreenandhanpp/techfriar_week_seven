import { combineReducers } from 'redux';
import { userReducer } from './reducers/signupReducer';
import { verifyReducer } from './reducers/verifyOtp';
import { resendOtp } from './reducers/resendOtp';
import { sendReducer } from './reducers/sendReducer';
import { updateReducer } from './reducers/updateReducer';
import { loginReducer } from './reducers/loginReducer';
import { productsReducer } from './reducers/productsReducer';
import { productReducer } from './reducers/productReducer';



export const rootReducers = combineReducers({
    userData: userReducer,
    verify: verifyReducer,
    resendOtp:resendOtp,
    sendOtp : sendReducer,
    updatedData: updateReducer,
    login : loginReducer,
    products : productsReducer,
    product : productReducer
})

