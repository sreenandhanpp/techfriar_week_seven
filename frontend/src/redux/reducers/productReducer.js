import { USER } from "../constants/user"
import {setItem} from "../../../localStorage/setItem"
import { ADMIN } from "../constants/admin"

let initialState = {
    loading:false,
    error:"",
    data:{}
}

export const productReducer = (state = initialState,action) => {
    switch(action.type){
        case ADMIN.FETCH_PRODUCT_REQUEST:
            return { ...state, loading:true}
        case ADMIN.FETCH_PRODUCT_SUCCESS:
            return { ...state,loading: false,data: action.payload }
        case ADMIN.FETCH_PRODUCT_FAILED:
            return { ...state,loading: false,error: action.payload }
        default:
            return state
    }
}

