const token = localStorage.getItem("userToken");




export const googleMapApi = "AIzaSyAW5O831v7xI0OVGJufVHJiIcJgeMybNdA";

// cloud functions API
export const DELETE_AUTH_USER =
  "https://us-central1-niteout-fff9b.cloudfunctions.net/deleteUserFromAuth";

export const ADD_AUTH_USER =
  "https://us-central1-niteout-fff9b.cloudfunctions.net/addUserInAuth";
export const baseURL = "https://groups-backend.herokuapp.com/api/v1";
export const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};
