import { USER } from "../constants/user"
import {setItem} from "../../../localStorage/setItem"

let initialState = {
    loading:false,
    error:"",
    data:{}
}

export const aadharReducer = (state = initialState,action) => {
    switch(action.type){
        case USER.AADHAR_VERIFY_REQUEST:
            return { ...state, loading:true}
        case USER.AADHAR_VERIFY_SUCCESS:
            return { ...state,loading: false,data: action.payload }
        case USER.AADHAR_VERIFY_FAILED:
            return { ...state,loading: false,error: action.payload }
        default:
            return state
    }
}

