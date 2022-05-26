const token = localStorage.getItem("userToken");

export const baseURL = "https://groups-backend.herokuapp.com/api/v1";
export const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};
