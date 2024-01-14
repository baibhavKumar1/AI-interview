import { useRef, useState } from "react";

export const VideoRecorder = () => {
  const videoRef = useRef();
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [stream, setStream] = useState(null);

  const startRecording = async () => {
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    videoRef.current.srcObject = newStream;

    const recorder = new MediaRecorder(newStream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks((prev) => prev.concat(e.data));
      }
    };

    setMediaRecorder(recorder);
    setStream(newStream);
    recorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.onstop = () => {};
      mediaRecorder.stop();
      videoRef.current.srcObject = null;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const saveRecording = () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      console.log(blob);
      setRecordedChunks([]);
    }
  };

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <button onClick={saveRecording}>Save Recording</button>
      <video ref={videoRef} controls autoPlay />
    </div>
  );
};

export default VideoRecorder;
