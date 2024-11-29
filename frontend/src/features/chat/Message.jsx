import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../auth/authSlice";

const Message = ({ message }) => {
  const authUser = useSelector(selectLoggedInUser);

  const scroll = useRef();
  const { selectedCustomerCare } = useSelector((store) => store.user);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={scroll}
      className={`chat ${
        message?.senderId === authUser?._id ? "chat-end" : "chat-start"
      }`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={
              message?.senderId === authUser?._id
                ? authUser?.profilePhoto
                : selectedCustomerCare?.profilePhoto
            }
          />
        </div>
      </div>
      <div className="chat-header">
        <time className="text-xs opacity-50 text-white">12:45</time>
      </div>
      <div
        className={`chat-bubble ${
          message?.senderId !== authUser?._id ? "bg-gray-200 text-black" : ""
        } `}
      >
        {message?.message}
      </div>
    </div>
  );
};

export default Message;
