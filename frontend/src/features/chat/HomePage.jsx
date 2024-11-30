import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import MessageContainer from "./MessageContainer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectLoggedInUser } from "../auth/authSlice";
import { MdChat } from "react-icons/md";
import toast from "react-hot-toast";
import { useAlert } from "react-alert";

const HomePage = () => {
  const user = useSelector(selectLoggedInUser);
  const alert = useAlert();

  const [startChat, setStartChat] = useState(false);

  const navigate = useNavigate();
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, []);
  return (
    <div className="fixed bottom-5 right-5" style={{ zIndex: 10000 }}>
      {startChat ? (
        <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-80 relative">
          <button
            className="absolute top-2 right-2 text-white font-bold hover:text-red-500"
            onClick={() => {
              setStartChat(false);
            }}
          >
            X
          </button>
          {user?.role === "customerCare" && <Sidebar />}
          <MessageContainer />
        </div>
      ) : (
        <button
          onClick={() => {
            if (!user) {
              toast.error("Please login to start chat.");
              alert.info("Please login to start chat.");

              navigate("/login");
              return;
            }
            setStartChat(true);
          }}
        >
          <MdChat className="text-6xl" />
        </button>
      )}
    </div>
  );
};

export default HomePage;
