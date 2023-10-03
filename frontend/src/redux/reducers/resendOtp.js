import { USER } from "../constants/user";

let initialState = {
    loading:false,
    error:"",
    data:{}
}

export const resendOtp = (state = initialState,action) => {
    switch(action.type){
        case USER.RESEND_OTP_REQUEST:
            return { ...state, loading:true}
        case USER.RESEND_OTP_SUCCESS:
            return { ...state,loading: false,data: action.payload }
        case USER.RESEND_OTP_FAILED:
            return { ...state,loading: false,error: action.payload }
        default:
            return state
    }
}

