import { USER } from "../constants/user"
import {setItem} from "../../../localStorage/setItem"

let initialState = {
    loading:false,
    error:"",
    data:{}
}

export const updateReducer = (state = initialState,action) => {
    switch(action.type){
        case USER.UPDATE_USER_REQUEST:
            return { ...state, loading:true}
        case USER.UPDATE_USER_SUCCESS:
            return { ...state,loading: false,data: action.payload }
        case USER.UPDATE_USER_FAILED:
            return { ...state,loading: false,error: action.payload }
        default:
            return state
    }
}

