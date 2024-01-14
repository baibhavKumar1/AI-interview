import {
  GET_LOGOUT_LOADING,
  GET_LOGOUT_ERROR,
  GET_LOGOUT_SUCCESS,
  POST_CREATEUSER_ERROR,
  POST_CREATEUSER_LOADING,
  POST_CREATEUSER_SUCCESS,
  POST_LOGIN_ERROR,
  POST_LOGIN_LOADING,
  POST_LOGIN_SUCCESS,
  GET_LOGGEDUSER_ERROR,
  GET_LOGGEDUSER_LOADING,
  GET_LOGGEDUSER_SUCCESS,
  PATCH_LOGGEDUSER_SUCCESS,
  GET_USERINTERVIEWS_ERROR,
  GET_USERINTERVIEWS_LOADING,
  GET_USERINTERVIEWS_SUCCESS,
  GET_LEADERBOARD_LOADING,
  GET_LEADERBOARD_ERROR,
  GET_LEADERBOARD_SUCCESS,
} from "./actionTypes";
import { Action } from "./types";

interface State {
  isLoading: boolean;
  isError: boolean;
  isAuth: boolean;
  token: string | null;
  loggedInUser: any | null;
  userInterviews: [];
  leaderboard: [];
}

const initState: State = {
  isLoading: false,
  isError: false,
  isAuth: false,
  token: null,
  loggedInUser: null,
  userInterviews: [],
  leaderboard: [],
};

export const reducer = (state: State = initState, action: Action): State => {
  switch (action.type) {
    case POST_CREATEUSER_LOADING:
      return {
        ...initState,
        isLoading: true,
      };
    case POST_CREATEUSER_ERROR:
      return {
        ...initState,
        isError: true,
      };
    case POST_CREATEUSER_SUCCESS:
      return {
        ...initState,
      };
    case POST_LOGIN_LOADING:
      return {
        ...initState,
        isLoading: true,
      };
    case POST_LOGIN_ERROR:
      return {
        ...initState,
        isError: true,
      };
    case POST_LOGIN_SUCCESS:
      return {
        ...initState,
        isAuth: true,
        token: action.payload,
      };
    case GET_LOGOUT_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_LOGOUT_ERROR:
      return {
        ...state,
      };
    case GET_LOGOUT_SUCCESS:
      return {
        ...initState,
      };
    case GET_LOGGEDUSER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_LOGGEDUSER_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case GET_LOGGEDUSER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        loggedInUser: action.payload,
      };
    case PATCH_LOGGEDUSER_SUCCESS:
      return {
        ...state,
        loggedInUser: action.payload,
      };
    case GET_USERINTERVIEWS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_USERINTERVIEWS_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case GET_USERINTERVIEWS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        userInterviews: action.payload,
      };
    case GET_LEADERBOARD_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_LEADERBOARD_ERROR:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case GET_LEADERBOARD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        leaderboard: action.payload,
      };
    default:
      return state;
  }
};
