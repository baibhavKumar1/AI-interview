import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { useToast } from "./custom/ToastProvider";
import {
  UPDATE_USER_ERROR,
  UPDATE_USER_LOADING,
  UPDATE_USER_SUCCESS,
} from "../redux/authReducer/actionTypes";


interface UserProfile {
  profilePicture: string;
  username: string;
  email: string;
  bio: string;
  password: string;
  confirm_password: string;
}
const initialState = {
  username: "",
  password: "",
  confirm_password: "",
  bio: "",
};

interface ProfileModalProps {
  isOpen: boolean;
  closeModal: () => void;
  userData: UserProfile;
  onEditProfile: (updatedData: UserProfile) => void;
}
const ProfileModal: React.FC = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(
    (store: RootState) => store.authReducer.loggedInUser
  );
  // console.log(loggedInUser, "log");
  const toast = useToast();
  const navigate = useNavigate();

  const token: String | null = useSelector(
    (store: RootState) => store.authReducer.token
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };
  const [updateUserData, setUpdateUserData] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveClick = () => {
    //  Perform validation (e.g., check if passwords match)

    const { username, password, confirm_password, bio } = updateUserData;
    if (password !== confirm_password) {
      alert("Passwords do not match!");
      return;
    } else {
      // console.log(updateUserData, "payload");
      updateUser(updateUserData, toast, navigate);
      //  console.log(loggedInUser._id,"id")
    }
  };

  const updateUser = async (userObj: any, toast: any, navigate: any) => {
    dispatch({ type: UPDATE_USER_LOADING });
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/user/update/${loggedInUser._id}`,
        userObj,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        dispatch({
          type: UPDATE_USER_SUCCESS,
        });
        toast("success", "User Details updates Please Login !");
        return navigate("/login");
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: UPDATE_USER_ERROR });
      toast("error", "Oops! Update failed!");
    }
  };
  const { username, password, confirm_password, bio } = updateUserData;

  return (
    <>
      <div className="p-1 w-96 mx-auto text-center">
        <h2>Profile Information</h2>

        {isEditing ? (
          <div className="text-left">
            <div className="flex justify-center mb-3">
              <img
                className="w-24 h-24 p-1 m-3 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 "
                src={loggedInUser.profileImage}
                alt="Bordered avatar"
              />
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="floating_email"
                id="floating_email"
                value={loggedInUser.username}
                onChange={(e) =>
                  setUpdateUserData({
                    ...updateUserData,
                    ["username"]: e.target.value,
                  })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Username
              </label>
            </div>

            <div className="relative z-0 w-full mb-6 group">
              <input
                type="password"
                name="floating_password"
                id="floating_password"
                value={password}
                onChange={(e) =>
                  setUpdateUserData({
                    ...updateUserData,
                    ["password"]: e.target.value,
                  })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Password
              </label>
            </div>

            <div className="relative z-0 w-full mb-6 group">
              <input
                type="password"
                name="repeat_password"
                id="floating_repeat_password"
                value={confirm_password}
                onChange={(e) =>
                  setUpdateUserData({
                    ...updateUserData,
                    ["confirm_password"]: e.target.value,
                  })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Confirm password
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="floating_email"
                id="floating_email"
                value={loggedInUser.bio}
                onChange={(e) =>
                  setUpdateUserData({
                    ...updateUserData,
                    ["bio"]: e.target.value,
                  })
                }
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Bio
              </label>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setIsEditing(false)} className="btn mt-3">
                Back
              </button>
              <button onClick={handleSaveClick} className="btn mt-3">
                Update
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center mb-3">
              <img
                className="w-24 h-24 p-1 m-3 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 "
                src={loggedInUser?.profileImage}
                alt="Bordered avatar"
              />
            </div>
            <div className="flex justify-around ">
              <div className="text-black text-x">
                <p className="mb-1">
                  {" "}
                  Username : {` ${loggedInUser.username}`}
                </p>
                <p>Bio : {`${loggedInUser.bio}`}</p>
                <p>Email: {loggedInUser.email}</p>
              </div>
            </div>
            <button onClick={() => setIsEditing(true)} className="btn mt-2 ">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileModal;
