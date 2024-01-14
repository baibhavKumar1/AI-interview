import React, { useEffect, useState } from "react";
import {
  GET_USERINTERVIEWS_ERROR,
  GET_USERINTERVIEWS_LOADING,
  GET_USERINTERVIEWS_SUCCESS,
} from "../redux/authReducer/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useToast } from "./custom/ToastProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SmallLoader } from "./common/SmallLoader";
import { Error } from "./common/Error";
import { Modal } from "./Modal";

export const UserInterviews: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, token, userInterviews, loggedInUser } =
    useSelector((store: RootState) => store.authReducer);
  console.log(userInterviews, "userInterviews");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (token) {
      getUserInterviews();
    } else {
      toast("error", "You must be logged in");
      navigate("/login");
    }
  }, []);

  const getUserInterviews = async () => {
    dispatch({ type: GET_USERINTERVIEWS_LOADING });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/interview`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data) {
        dispatch({
          type: GET_USERINTERVIEWS_SUCCESS,
          payload: response.data.userInterviews,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: GET_USERINTERVIEWS_ERROR });
      toast("error", "Oops! Couldn't fetch you interviews!");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3.5">
      {isLoading ? (
        <SmallLoader />
      ) : isError ? (
        <Error />
      ) : (
        userInterviews.length > 0 &&
        userInterviews.map((el: any) => {
          return (
            <div className="rounded-md shadow-md p-4 flex gap-4">
              <video className="h-full w-3/5 rounded-lg" controls>
                <source
                  src={`${process.env.REACT_APP_API_URL}/${el.videoPath}`}
                />
                Your browser does not support the video tag.
              </video>
              <div className="flex flex-col justify-between">
                <div>
                  <h3>
                    Type:{" "}
                    <span className="text-primary_green">
                      {el.interviewType}
                    </span>
                  </h3>
                  <h3>
                    Interview Score:{" "}
                    <span className="text-primary_green">
                      {el.feedback.overallScore}/10
                    </span>
                  </h3>
                </div>
                <div>
                  <button className="btn-outline" onClick={openModal}>
                    View Details
                  </button>
                  <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div
                      className="p-8 mx-auto overflow-y-scroll"
                      style={{ height: "80vh" }}
                    >
                      <h2 className="mb-4">
                        Details Of The Interview{" "}
                        <span className="text-primary_green font-normal">
                          {el.interviewType}
                        </span>
                      </h2>
                      <video className="h-4/5/3 w-4/5 rounded-lg mb-4" controls>
                        <source
                          src={`${process.env.REACT_APP_API_URL}/${el.videoPath}`}
                        />
                        Your browser does not support the video tag.
                      </video>
                      <h3 className="mb-2">Detailed Feedback</h3>
                      {el.feedback.strengths.length > 0 && (
                        <>
                          <h4 className="mb-1">Your Strengths :</h4>
                          <ul className="list-disc mb-4">
                            {el.feedback.strengths.map((ele: any) => {
                              return <li>{ele}</li>;
                            })}
                          </ul>
                        </>
                      )}
                      {el.feedback.improvementAreas.length > 0 && (
                        <>
                          <h4 className="mb-2">Improvement Areas:</h4>
                          <ul className="list-disc mb-4">
                            {el.feedback.improvementAreas.map((ele: any) => {
                              return <li>{ele}</li>;
                            })}
                          </ul>
                        </>
                      )}
                      <div>
                        <h4 className="mb-2">Conversation :</h4>
                        <div className="h-64 w-96 overflow-y-scroll mb-8">
                          {el.conversation.length > 0 &&
                            el.conversation.slice(1).map((ele: any) => {
                              return (
                                <div
                                  className={`w-full shadow-md rounded-md p-4 my-2 flex flex-col gap-2 justify-between ${ele.role == "user"
                                      ? "bg-slate-400"
                                      : "bg-gray-200"
                                    }`}
                                >
                                  <div className="w-full flex gap-4 items-center">
                                    <img
                                      className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                                      src={
                                        ele.role == "user"
                                          ? `${loggedInUser?.profileImage}`
                                          : "https://img.freepik.com/premium-vector/robot-icon-circle-vector-illustration_418020-199.jpg"
                                      }
                                      alt="Bordered avatar"
                                    />
                                    <div className="inline-block  min-h-[1em] w-0.5 self-stretch bg-neutral-100 opacity-100 dark:opacity-50"></div>
                                    <h3>
                                      {ele.role == "user"
                                        ? `${loggedInUser.username}`
                                        : "Interviewer"}
                                    </h3>
                                  </div>
                                  <p>{ele.content}</p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <div className="py-4 flex items-center justify-between">
                      <button className="btn-outline" onClick={closeModal}>
                        Close Details
                      </button>
                      <h2>
                        Score{" "}
                        <span className="text-primary_green font-normal">
                          {el.feedback.overallScore}/10
                        </span>
                      </h2>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
