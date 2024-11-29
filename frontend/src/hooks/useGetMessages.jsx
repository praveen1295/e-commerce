import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../features/chat/messageSlice";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(`${BASE_URL}/message/${selectedUser?._id}`);
        dispatch(setMessages(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [selectedUser?._id, setMessages]);
};

export default useGetMessages;
