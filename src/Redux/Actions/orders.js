import { ORDERS} from "../ActionTypes";

export const orders  = (payload) => {
return{
    type: ORDERS,
    payload: payload,
}
};