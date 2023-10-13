import { USER } from "../constants/user";
import { setItem } from "../../../localStorage/setItem";
import { COMMON } from "../constants/common";

let initialState = {
  loading: false,
  error: "",
  data: [],
};

export const bookedDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case COMMON.FETCH_BOOKED_DETAILS_REQUEST:
      return { ...state, loading: true };
    case COMMON.FETCH_BOOKED_DETAILS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case COMMON.FETCH_BOOKED_DETAILS_SUCCESS:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
