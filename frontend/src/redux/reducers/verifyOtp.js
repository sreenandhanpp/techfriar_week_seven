import { USER } from "../constants/user"
import {setItem} from "../../../localStorage/setItem"

let initialState = {
    loading:false,
    error:"",
    data:{}
}

export const verifyReducer = (state = initialState,action) => {
    switch(action.type){
        case USER.VERIFY_OTP_REQUEST:
            return { ...state, loading:true}
        case USER.VERIFY_OTP_SUCCESS:
            return { ...state,loading: false,data: action.payload }
        case USER.SIGNUP_FAILED:
            return { ...state,loading: false,error: action.payload }
        default:
            return state
    }
}

