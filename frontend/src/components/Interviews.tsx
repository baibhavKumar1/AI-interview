import React, { useEffect, useState } from "react";
import { useToast } from "./custom/ToastProvider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Modal } from "./Modal";
import { useNavigate } from "react-router-dom";
import { CHANGE_INTERVIEW_TYPE } from "../redux/interviewReducer/actionTypes";
import { UserInterviews } from "./UserInterviews";
import { UserAction } from "./UserAction";

interface Course {
  id: number;
  title: string;
  description: string;
}

const Interviews = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth: boolean = useSelector(
    (store: RootState) => store.authReducer.isAuth
  );
  const token: String | null = useSelector(
    (store: RootState) => store.authReducer.token
  );
  const loggedInUser = useSelector(
    (store: RootState) => store.authReducer.loggedInUser
  );
  // console.log(isAuth, token, loggedInUser, "Dashboard");
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  const [type, setType] = useState<String>("");

  useEffect(() => {
    if (type) {
      dispatch({ type: CHANGE_INTERVIEW_TYPE, payload: type });
    }
  }, [type]);

  return (
    <div>
      <div className=" mx-auto p-8  bg-white rounded-lg shadow-lg">
        <div className="mb-4">
          <ul className="flex gap-5">
            <li
              className={`mr-4 cursor-pointer ${
                selectedTab === 0 && "border-b-2 border-primary_green"
              }`}
            >
              <div onClick={() => handleTabChange(0)}>
                <h4 className={`${selectedTab == 0 && "text-primary_green"}`}>
                  Get Started
                </h4>
              </div>
            </li>
            <li
              className={`cursor-pointer ${
                selectedTab === 1 && "border-b-2 border- border-primary_green"
              }`}
            >
              <div onClick={() => handleTabChange(1)}>
                <h4 className={`${selectedTab == 1 && "text-primary_green"}`}>
                  Completed Interviews
                </h4>
              </div>
            </li>
          </ul>
        </div>

        <div>
          {selectedTab === 0 && <UserAction openModal={openModal} />}
          {selectedTab === 1 && <UserInterviews />}
        </div>
      </div>
      <div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10%",
              textAlign: "center",
              gap: "20px",
            }}
          >
            <div
              className={`cursor-pointer hover:bg-primary_green hover:text-text bg-${
                type == "MERN" ? "primary_green" : "transparent"
              }`}
              style={{
                border: "1px solid black",
                width: "100px",
                height: "50px",
                paddingTop: "10px",
              }}
              onClick={() => setType("MERN")}
            >
              MERN
            </div>
            <div
              className={`cursor-pointer hover:bg-primary_green hover:text-text bg-${
                type == "Java" ? "primary_green" : "transparent"
              }`}
              style={{
                border: "1px solid black",
                width: "100px",
                height: "50px",
                paddingTop: "10px",
              }}
              onClick={() => setType("Java")}
            >
              JAVA
            </div>
            <div
              className={`cursor-pointer hover:bg-primary_green hover:text-text bg-${
                type == "DSA" ? "primary_green" : "transparent"
              }`}
              style={{
                border: "1px solid black",
                width: "100px",
                height: "50px",
                paddingTop: "10px",
              }}
              onClick={() => setType("DSA")}
            >
              DSA
            </div>
          </div>
          <div style={{ marginLeft: "25%" }}>
            <button
              className="btn"
              disabled={!type}
              onClick={() => navigate("/dashboard/start_interview")}
            >
              Start the Interview
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Interviews;
