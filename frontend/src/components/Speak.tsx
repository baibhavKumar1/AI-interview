import React, { useState, useEffect, ChangeEvent } from "react";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

interface SpeakProps {
  value: string;
}

const Speak: React.FC<SpeakProps> = ({ value }) => {
  const latest = useSelector(
    (store: RootState) => store.interviewReducer.latest
  );

  const [voiceType, setVoiceType] = useState<string>("female");
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1);

  const speak = () => {
    const message = new SpeechSynthesisUtterance(value);
    const voices = window.speechSynthesis.getVoices();

    if (voiceType === "male") {
      message.voice = voices[8];
    } else {
      message.voice = voices[6];
    }

    message.rate = voiceSpeed;
    window.speechSynthesis.speak(message);
  };

  const handleVoiceTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setVoiceType(e.target.value);
  };

  const handleVoiceSpeedChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setVoiceSpeed(parseFloat(e.target.value));
  };
  useEffect(() => {
    speak();
  }, [latest]);

  return (
    <div>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-4"
        value={voiceType}
        onChange={handleVoiceTypeChange}
      >
        <option value="" disabled>
          Select Voice Type
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 inline-block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-4" value={voiceSpeed} onChange={handleVoiceSpeedChange}>
        <option value="" disabled>
          Select Voice Speed
        </option>
        <option value="0.5">x0.5</option>
        <option value="1">x1</option>
        <option value="1.5">x1.5</option>
        <option value="2">x2</option>
      </select>
      <button
        onClick={speak}
        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Speech
      </button>
    </div>
  );
};

export { Speak };
