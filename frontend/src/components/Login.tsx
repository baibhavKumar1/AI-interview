import React, { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authReducer/action";
import { useToast } from "./custom/ToastProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  POST_LOGIN_ERROR,
  POST_LOGIN_LOADING,
  POST_LOGIN_SUCCESS,
  GET_LOGGEDUSER_SUCCESS,
} from "../redux/authReducer/actionTypes";

export const Login: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email && password) {
      let userObj: any = { email, password };
      console.log(userObj);
      loginUser(userObj, toast, navigate);
    }
  };
  const loginUser = async (userObj: any, toast: any, navigate: any) => {
    dispatch({ type: POST_LOGIN_LOADING });
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        userObj,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "LOGIN");
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        dispatch({ type: POST_LOGIN_SUCCESS, payload: response.data.token });
        const userWithProfileImage = response.data.user;
        userWithProfileImage.profileImage = `${process.env.REACT_APP_API_URL}/${userWithProfileImage.profileImage}`;
        console.log(userWithProfileImage);
        dispatch({
          type: GET_LOGGEDUSER_SUCCESS,
          payload: userWithProfileImage,
        });
        navigate("/");
        toast("success", "Login successful!");
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: POST_LOGIN_ERROR });
      toast("error", "Oops! Login failed!");
    }
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary_green focus:border-primary_green block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary_green focus:border-primary_green block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary_green dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary_green dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary_green hover:underline dark:text-primary_green"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary_green hover:bg-primary_green focus:ring-4 focus:outline-none focus:ring-primary_green font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary_green dark:hover:bg-primary_green dark:focus:ring-primary_green"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <a
                  href="/signup"
                  className="font-medium text-primary_green hover:underline dark:text-primary_green"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
