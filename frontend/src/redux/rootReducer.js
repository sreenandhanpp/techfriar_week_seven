import { combineReducers } from 'redux';
import { userReducer } from './reducers/signupReducer';
import { verifyReducer } from './reducers/verifyOtp';
import { resendOtp } from './reducers/resendOtp';
import { pincodeReducer } from './reducers/pincodeReducer';
import { aadharReducer } from './reducers/aadharReducer';
import { sendReducer } from './reducers/sendReducer';
import { updateReducer } from './reducers/updateReducer';



export const rootReducers = combineReducers({
    userData: userReducer,
    verify: verifyReducer,
    resendOtp:resendOtp,
    pincodeData: pincodeReducer,
    aadharData: aadharReducer,
    sendOtp : sendReducer,
    updatedData: updateReducer
})

