import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../auth/authSlice";

const Message = ({ message }) => {
  const authUser = useSelector(selectLoggedInUser);
  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isSender = message?.senderId === authUser?.id;

  return (
    <div
      ref={scroll}
      className={`flex items-end ${isSender ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar */}
      {!isSender && (
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img
            src={
              message?.senderId === authUser?.id
                ? authUser?.profilePhoto
                : message?.profilePhoto
            }
            alt="profile"
          />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isSender ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        <p>{message?.message}</p>
      </div>
    </div>
  );
};

export default Message;
