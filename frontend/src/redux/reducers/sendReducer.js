import { USER } from "../constants/user"
import {setItem} from "../../../localStorage/setItem"

let initialState = {
    loading:false,
    error:"",
}

export const sendReducer = (state = initialState,action) => {
    switch(action.type){
        case USER.SEND_OTP_REQUEST:
            return { ...state, loading:true}
        case USER.SEND_OTP_SUCCESS:
            return { ...state,loading: false }
        case USER.AADHAR_VERIFY_FAILED:
            return { ...state,loading: false,error: action.payload }
        default:
            return state
    }
}

