import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "./messageSlice";
import { selectLoggedInUser } from "../auth/authSlice";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SendInput = () => {
  const dispatch = useDispatch();
  // const user = useSelector(selectLoggedInUser);

  const [message, setMessage] = useState("");
  const { selectedCustomerCare } = useSelector((store) => store.customerCare);
  console.log("selectedCustomerCare", selectedCustomerCare);
  const { messages } = useSelector((store) => store.message);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/message/send/${selectedCustomerCare?.id}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("res?.data?.newMessage", res?.data?.newMessage);
      dispatch(setMessages([...messages, res?.data?.newMessage]));
    } catch (error) {
      console.log(error);
    }
    setMessage("");
  };
  return (
    <form onSubmit={onSubmitHandler} className="px-4 my-3">
      <div className="w-full relative">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Send a message..."
          className="border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white"
        />
        <button
          type="submit"
          className="absolute flex inset-y-0 end-0 items-center pr-4"
        >
          <IoSend />
        </button>
      </div>
    </form>
  );
};

export default SendInput;
