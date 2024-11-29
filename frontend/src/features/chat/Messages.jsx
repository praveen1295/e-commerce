import React from "react";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessages";
import { useSelector } from "react-redux";
import useGetRealTimeMessage from "../../hooks/useGetRealTimeMessages";

const Messages = () => {
  useGetMessages();
  useGetRealTimeMessage();
  const { messages } = useSelector((store) => store.message);

  return (
    <div className="p-4 space-y-4">
      {messages &&
        messages.map((message) => (
          <Message key={message._id} message={message} />
        ))}
    </div>
  );
};

export default Messages;
