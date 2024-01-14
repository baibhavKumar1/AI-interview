import React, { useEffect, useState, useRef } from "react";
import { AudioToText } from "./AudioToText";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  POST_STARTINTERVIEW_ERROR,
  POST_STARTINTERVIEW_LOADING,
  POST_STARTINTERVIEW_SUCCESS,
  POST_ENDINTERVIEW_ERROR,
  POST_ENDINTERVIEW_SUCCESS,
  POST_ENDINTERVIEW_LOADING,
} from "../redux/interviewReducer/actionTypes";
import { PATCH_LOGGEDUSER_SUCCESS } from "../redux/authReducer/actionTypes";
import { useNavigate } from "react-router-dom";
import { useToast } from "./custom/ToastProvider";
import { SmallLoader } from "./common/SmallLoader";
import { Error } from "./common/Error";
import { PageLoader } from "./common/PageLoader";

export const InterviewRoom: React.FC = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loggedInUser } = useSelector(
    (store: RootState) => store.authReducer
  );
  const {
    isPageLoading,
    isLoading,
    isError,
    interviewId,
    conversation,
    latest,
    type,
  } = useSelector((store: RootState) => store.interviewReducer);

  // console.log(interviewId, conversation, latest);
  // useEffect(() => {
  //   //start request ot backend
  //   handleStartInterview();
  // }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stopRecording = () => {
    if (mediaRecorder && stream) {
      mediaRecorder.onstop = () => {};
      mediaRecorder.stop();
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      stream.getTracks().forEach((track) => track.stop());
    }
  };
  
  const handleEndInterview = async () => {
    dispatch({ type: POST_ENDINTERVIEW_LOADING });
    try {
      stopRecording();
      const formData = new FormData();
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      
      formData.append("videoPath", blob, "recorded_video.webm");

      formData.append("conversation", JSON.stringify(conversation));
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/interview/end/${interviewId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecordedChunks([]);
      console.log(response.data);
      dispatch({ type: POST_ENDINTERVIEW_SUCCESS });
      const userWithProfileImage = response.data.updatedUser;
      userWithProfileImage.profileImage = `${process.env.REACT_APP_API_URL}/${userWithProfileImage.profileImage}`;
      dispatch({
        type: PATCH_LOGGEDUSER_SUCCESS,
        payload: userWithProfileImage,
      });
      toast("success", `${response.data.message}`);
      navigate("/dashboard");
    } catch (e: any) {
      console.log(e);
      dispatch({ type: POST_ENDINTERVIEW_ERROR });
      toast("error", `${e.response.data.message}`);
      setRecordedChunks([]);
    }
  };

  useEffect(() => {
    const startInterview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setStream(stream);
        const recorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp9,opus",
        });
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setRecordedChunks((prev) => [...prev, e.data]);
          }
        };

        setMediaRecorder(recorder);
        setStream(stream);
        recorder.start();

        dispatch({ type: POST_STARTINTERVIEW_LOADING });
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/interview/start`,
          { type: type },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch({ type: POST_STARTINTERVIEW_SUCCESS, payload: response.data });
      } catch (e) {
        console.log(e);
        dispatch({ type: POST_STARTINTERVIEW_ERROR });
      }
    };

    startInterview();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (isPageLoading) {
    return <PageLoader />;
  }
  return (
    <div className="border min-h-screen overflow-hidden flex justify-between">
      <div className="relative flex-grow bg-slate-200">
        <div className=" flex items-center justify-between p-4 gap-2 shadow-md overflow-x-hidden bg-white">
          <div className="flex items-center gap-4">
            <img
              className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
              src={`${loggedInUser?.profileImage}`}
              alt="Bordered avatar"
            />
            <h2>{loggedInUser.username}</h2>
          </div>
          <h2>
            Ongoing Interview : <strong>{type} Interview</strong>
          </h2>
        </div>
        <div className="py-40 px-4 relative">
          <div className="flex gap-4">
            <div className="relative border-2 w-1/2 h-96 rounded-lg bg-gray-600 border-gray-50">
              <img
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                src="https://img.freepik.com/premium-vector/robot-icon-circle-vector-illustration_418020-199.jpg"
                alt=""
              />
            </div>
            <div className="relative border-2 w-1/2 h-96 rounded-lg bg-gray-600 border-gray-50 overflow-hidden">
              <video ref={videoRef} controls autoPlay muted />
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 items-center">
            <button className="btn bg-red-500" onClick={handleEndInterview}>
              End Interview
            </button>
            <button onClick={stopRecording} className="btn-outline">
              Stop Recording
            </button>
          </div>
        </div>
      </div>
      <div className="bg-text p-4 w-1/3 flex-col gap-8 border-l">
        <div className="p-4 flex-grow mb-12 bg-white w-full h-3/5 rounded-md border scroll-m-0 overflow-y-scroll overflow-x-hidden">
          {isLoading ? <SmallLoader /> : isError && <Error />}
          {conversation.length > 0 &&
            conversation
              .slice(1)
              .reverse()
              .map((el: any, i) => {
                return (
                  <div
                    key={i}
                    className={`shadow-md rounded-md p-4 my-2 flex flex-col gap-2 justify-between ${
                      el.role == "user" ? "bg-slate-400" : "bg-gray-200"
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                        src={
                          el.role == "user"
                            ? `${loggedInUser?.profileImage}`
                            : "https://img.freepik.com/premium-vector/robot-icon-circle-vector-illustration_418020-199.jpg"
                        }
                        alt="Bordered avatar"
                      />
                      <div className="inline-block  min-h-[1em] w-0.5 self-stretch bg-neutral-100 opacity-100 dark:opacity-50"></div>
                      <h3>
                        {el.role == "user"
                          ? `${loggedInUser.username}:`
                          : "Interviewer:"}
                      </h3>
                    </div>
                    <p>{el.content}</p>
                  </div>
                );
              })}
        </div>
        <AudioToText></AudioToText>
      </div>
    </div>
  );
};
