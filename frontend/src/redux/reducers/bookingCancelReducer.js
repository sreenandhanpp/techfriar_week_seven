import { USER } from "../constants/user"

let initialState = {
    loading:false,
    error:"",
    message:""
}

export const bookingCancelReducer = (state = initialState,action) => {
    switch(action.type){
        case USER.BOOKING_CANCEL_REQUEST:
            return { ...state, loading:true}
        case USER.BOOKING_CANCEL_SUCCESS:
            return { ...state,loading: false,message: action.payload }
        case USER.BOOKING_CANCEL_FAILED:
            return { ...state,loading: false,error: action.payload }
        default:
            return state
    }
}

