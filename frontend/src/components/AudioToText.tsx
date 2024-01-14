import React, { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  PATCH_ANSWER_ERROR,
  PATCH_ANSWER_LOADING,
  PATCH_ANSWER_SUCCESS,
} from "../redux/interviewReducer/actionTypes";
import axios from "axios";
import { SpeakToText } from "./SpeakToText";

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

const AudioToText: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((store: RootState) => store.authReducer.token);
  const { isLoading, isError, interviewId, conversation, latest } = useSelector(
    (store: RootState) => store.interviewReducer
  );

  // console.log(latest, "AUDIO component");
  const [isListening, setIsListening] = useState(false);
  const [value, setValue] = useState<string>("");
  const [render, setRender] = useState(false);

  useEffect(() => {
    handleListen();
  }, [isListening, render]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
    } else {
      mic.stop();
    }

    mic.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join("");
      // console.log(transcript);
      setValue(transcript);
    };
  };

  const handleSend = async () => {
    dispatch({ type: PATCH_ANSWER_LOADING });
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/interview/${interviewId}`,
        { conversation: [...conversation, { role: "user", content: value }] },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      dispatch({ type: PATCH_ANSWER_SUCCESS, payload: response.data });
      setValue("");
    } catch (e) {
      console.log(e);
      dispatch({ type: PATCH_ANSWER_ERROR });
      setValue("");
    }
    setRender(!render);
  };

  const handleStart = () => {};
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className="border-t-2 pt-8">
      <div>
        <div className="flex items-center justify-between">
          <div>
            {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
            <button
              onClick={() => setIsListening(true)}
              disabled={isListening}
              className="btn-outline"
            >
              Start
            </button>{" "}
            <span></span>
            <button
              onClick={(e) => setIsListening(false)}
              disabled={!isListening}
              className="btn-outline"
            >
              Stop
            </button>
          </div>

          <button onClick={handleSend} className="btn">
            Send
          </button>
        </div>
        <br />
        <div>
          <textarea
            value={value}
            onChange={handleChange}
            className="block p-2.5 h-32 mb-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your answers here..."
          ></textarea>
          <SpeakToText value={latest ? latest : value} />
        </div>
      </div>
    </div>
  );
};

export { AudioToText };
