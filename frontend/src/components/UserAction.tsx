import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./custom/ToastProvider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  GET_LEADERBOARD_ERROR,
  GET_LEADERBOARD_LOADING,
  GET_LEADERBOARD_SUCCESS,
} from "../redux/authReducer/actionTypes";
import axios from "axios";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface LeaderboardEntry {
  userId: string;
  overallScore: number;
  rank: number;
  username: string;
  profileImage?: string;
}

interface UserActionProps {
  openModal: () => void;
}

interface CustomTooltipProps {
  payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ payload }) => {
  if (!payload || payload.length === 0) return null;

  const user = payload[0]?.payload as LeaderboardEntry;

  if (!user) return null;

  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      {user.profileImage && (
        <img
          className="w-16 h-16 p-1 rounded-full ring-2 ring-primary_green dark:ring-gray-500"
          src={`${process.env.REACT_APP_API_URL}/${user.profileImage}`}
          alt="User"
        />
      )}
      <div className="mt-2">
        <h5>{user.username}</h5>
        <p>Rank: {user.rank}</p>
        <p>Overall Score: {user.overallScore}</p>
      </div>
    </div>
  );
};

export const UserAction: React.FC<UserActionProps> = ({ openModal }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const { token, leaderboard } = useSelector(
    (store: RootState) => store.authReducer
  );

  useEffect(() => {
    if (token) {
      getLeaderboard();
    } else {
      navigate("/login");
    }
  }, []);

  const getLeaderboard = async () => {
    dispatch({ type: GET_LEADERBOARD_LOADING });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/leaderboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data); // This should contain the leaderboard data
      dispatch({
        type: GET_LEADERBOARD_SUCCESS,
        payload: response.data.leaderboard,
      });
      // Dispatch the leaderboard data to the Redux store if needed
      // dispatch({ type: GET_LEADERBOARD_SUCCESS, payload: response.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: GET_LEADERBOARD_ERROR });
      toast("error", "Couldn't fetch leaderboard");
    }
  };

  return (
    <div>
      <button className="btn w-1/5 py-4 text-2xl mt-5" onClick={openModal}>
        Start Interview
      </button>
      <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
      <div>
        <h1 className="mb-8">Leaderboard</h1>
        <div>
          <ResponsiveContainer width="100%" height={450}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis dataKey="username" name="Username" />
              <YAxis dataKey="overallScore" name="Overall Score" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<CustomTooltip />}
              />
              <Scatter data={leaderboard} fill="#00a884" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
