import { LOGIN, LOGOUT, EMPTY_KEY } from "./ActionTypes";

export const userLogin = (data) => async (dispatch) => {
  dispatch({
    type: LOGIN,
    payload: data,
  });
};

/**
 * @description also removes all key/value pairs in local-storage
 */
export const userLogout = () => (dispatch) => {
  localStorage.clear();
  dispatch({
    type: LOGOUT,
  });
  dispatch({
    type: EMPTY_KEY,
  });
};
