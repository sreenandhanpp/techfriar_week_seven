import { USER } from "../constants/user"
import {setItem} from "../../../localStorage/setItem"

let initialState = {
    loading:false,
    error:"",
    data:{}
}

export const userReducer = (state = initialState,action) => {
    switch(action.type){
        case USER.SIGNUP_REQUEST:
            return { ...state, loading:true}
        case USER.SIGNUP_SUCCESS:
            setItem('user',action.payload)
            return { ...state,loading: false,data: action.payload }
        case USER.SIGNUP_FAILED:
            return { ...state,loading: false,error: action.payload }
        default:
            return state
    }
}

