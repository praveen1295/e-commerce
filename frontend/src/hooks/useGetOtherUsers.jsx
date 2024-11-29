import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../features/chat/userSlice";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(`${BASE_URL}/user`);
        // store
        console.log("other users -> ", res);
        dispatch(setOtherUsers(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchOtherUsers();
  }, []);
};

export default useGetOtherUsers;
