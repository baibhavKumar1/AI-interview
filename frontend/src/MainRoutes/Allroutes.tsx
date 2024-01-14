import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Interviews from "../components/Interviews";
import { Login } from "../components/Login";
import { Signup } from "../components/Signup";
import { InterviewRoom } from "../components/InterviewRoom";
import Profile from "../components/Profile";
import PrivateRoute from "./PrivateRoute";

const Allroutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Interviews />
          </PrivateRoute>
        }
      ></Route>
      <Route path="/dashboard/start_interview" element={<InterviewRoom />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
    </Routes>
  );
};

export default Allroutes;
