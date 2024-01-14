import { AnyAction, Dispatch } from "redux";
import {
  POST_CREATEUSER_ERROR,
  POST_CREATEUSER_LOADING,
  POST_CREATEUSER_SUCCESS,
  POST_LOGIN_ERROR,
  POST_LOGIN_LOADING,
  POST_LOGIN_SUCCESS,
  GET_LOGOUT_ERROR,
  GET_LOGOUT_LOADING,
  GET_LOGOUT_SUCCESS,
} from "./actionTypes";
import axios from "axios";
import { Action } from "./types";

export const createUser =
  (user: any, toast: any, navigate: any) => async (dispatch: any) => {
    
  };

export const loginUser =
  (userObj: any, toast: any, navigate: any) =>
   (dispatch: Dispatch): AnyAction => {
   return  dispatch({ type: POST_LOGIN_LOADING });
  };

export const logoutUser =
  (token: string, toast: any, navigate: any) => async (dispatch: any) => {
    dispatch({ type: GET_LOGOUT_LOADING });
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        config
      );
      localStorage.removeItem("token");
      toast("success", "Logged out successfully");
      dispatch({ type: GET_LOGOUT_SUCCESS });
      navigate("/");
    } catch (error) {
      console.log("Error while logging out:", error);
      dispatch({ type: GET_LOGOUT_ERROR });
      toast("error", "Something went wrong while logging out");
    }
  };
