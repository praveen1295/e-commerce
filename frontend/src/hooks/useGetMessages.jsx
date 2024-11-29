import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../features/chat/messageSlice";
import CustomerCare from "../features/customerCare/CustomerCare";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useGetMessages = () => {
  const { selectedCustomerCare } = useSelector((store) => {
    console.log("store=======>", store);
    return store.customerCare;
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          `${BASE_URL}/message/${selectedCustomerCare?.id}`
        );
        dispatch(setMessages(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [selectedCustomerCare?.id, setMessages]);
};

export default useGetMessages;
