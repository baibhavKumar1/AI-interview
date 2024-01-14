import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./custom/ToastProvider";
import { useDispatch } from "react-redux";
import {
  POST_CREATEUSER_ERROR,
  POST_CREATEUSER_LOADING,
  POST_CREATEUSER_SUCCESS,
} from "../redux/authReducer/actionTypes";
import axios from "axios";

type FormData = {
  username: string;
  email: string;
  password: string;
  bio: string;
};
export const Signup: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    bio: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files) {
        setProfileImage(fileInput.files[0]);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(formData, profileImage);
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("username", formData.username);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("bio", formData.bio);
    formDataToSubmit.append("profileImage", profileImage! as Blob);
    // if (profileImage !== null) {
    //   formDataToSubmit.append("profileImage", profileImage);
    // }

    createUser(formDataToSubmit, toast, navigate);
  };

  const createUser = async (user: any, toast: any, navigate: any) => {
    dispatch({ type: POST_CREATEUSER_LOADING });
    console.log(user);
    // console.log(user);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/signup`,
        user,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/login");
      dispatch({ type: POST_CREATEUSER_SUCCESS });
      toast("success", "Account created successfully");
    } catch (error) {
      console.log(error);
      dispatch({ type: POST_CREATEUSER_ERROR });
      toast("error", "Oops! Something went wrong");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create and account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="profileImage"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Profile Picture
                </label>
                <input
                  type="file"
                  name="profileImage"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary_green focus:border-primary_green block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary_green focus:border-primary_green block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Iamjohndoe"
                />
              </div>
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
                  onChange={handleChange}
                  id="email"
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
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary_green focus:border-primary_green block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  onChange={handleBioChange}
                  // Add placeholder text
                  placeholder="I am John Doe. I am a family friendly test user..."
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary_green focus:border-primary_green block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary_green dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary_green dark:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary_green hover:underline dark:text-primary_green"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary_green hover:bg-primary_green focus:ring-4 focus:outline-none focus:ring-primary_green font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary_green dark:hover:bg-primary_green dark:focus:ring-primary_green"
              >
                Create an account
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-primary_green hover:underline dark:text-primary_green"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
