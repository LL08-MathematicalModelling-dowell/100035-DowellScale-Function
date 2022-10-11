import {
  addUser,
  addUserSuccess,
  addUserFailure,
  deleteUser,
  deleteUserSuccess,
  deleteUserFailure,
  loginStart,
  loginFailure,
  loginSuccess,
} from "./userSlice";
import axios from "axios";

const userReq = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
    accept: "application/json",
  },
});

// Create
export const addNewUser = async (dispatch, user) => {
  dispatch(addUser());
  try {
    const res = await axios.post(
      "https://100014.pythonanywhere.com/api/profile/",
      user
    );
    console.log(res);
    dispatch(addUserSuccess(res.data));
  } catch (err) {
    console.log(err);
    dispatch(addUserFailure());
  }
};

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(
      "https://100014.pythonanywhere.com/api/profile/",
      user
    );
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

// Delete user
export const delUser = async (dispatch, id) => {
  dispatch(deleteUser());
  try {
    await axios.delete(`http://127.0.0.1:8000/delete_user/${id}/`);
    // console.log(res)
    dispatch(deleteUserSuccess(id));
  } catch (err) {
    console.log(err);
    dispatch(deleteUserFailure());
  }
};
