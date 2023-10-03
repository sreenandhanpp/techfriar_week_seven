import { USER } from "../constants/user"
import {setItem} from "../../../localStorage/setItem"

let initialState = {
    loading:false,
    error:"",
    data:null
}

export const pincodeReducer = (state = initialState,action) => {
    switch(action.type){
        case USER.FETCH_PIN_DETAILS_REQUEST:
            return { ...state, loading:true}
        case USER.FETCH_PIN_DETAILS_SUCCESS:
            setItem('pincode',action.payload)
            return { ...state,loading: false,data: action.payload }
        case USER.FETCH_PIN_DETAILS_FAILED:
            return { ...state,loading: false,error: action.payload }
        default:
            return state
    }
}

