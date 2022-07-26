import { ORDERS } from "../ActionTypes";

const initialState ={
    orders:[]
}

export const orders = (state = initialState, action) => {
  switch (action.type) {
    case ORDERS: {
      return action.payload;
    }
   
    default: {
      return state;
    }
  }
};