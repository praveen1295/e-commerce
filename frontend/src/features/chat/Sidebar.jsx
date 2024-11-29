import React, { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setCustomerCares,
  setSelectedCustomerCare,
} from "../customerCare/customerCareSlice";
import { setMessages } from "./messageSlice";
import CustomerCares from "../customerCare/CustomerCares";
import { fetchAllUsersAsync, selectUsers } from "../user/userSlice";
import { ITEMS_PER_PAGE } from "../../app/constants";
import { selectLoggedInUser } from "../auth/authSlice";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Sidebar = () => {
  const user = useSelector(selectLoggedInUser);

  const [search, setSearch] = useState("");
  // const { customerCares } = useSelector((store) => store.user);
  const customerCares = useSelector(selectUsers);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // const logoutHandler = async () => {
  //   try {
  //     const res = await axios.get(`${BASE_URL}/user/logout`);
  //     navigate("/login");
  //     toast.success(res.data.message);
  //     dispatch(setMessages(null));
  //     dispatch(setCustomerCares(null));
  //     dispatch(setSelectedCustomerCare(null));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    const conversationUser = customerCares?.find((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    if (conversationUser) {
      dispatch(setCustomerCares([conversationUser]));
    } else {
      toast.error("User not found!");
    }
  };

  useEffect(() => {
    const pagination = { _page: 1, _limit: ITEMS_PER_PAGE };

    dispatch(
      fetchAllUsersAsync({
        role: user?.role === "customerCare" ? "user" : "customerCare",
        pagination,
      })
    );
  }, []);
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <form
        onSubmit={searchSubmitHandler}
        action=""
        className="flex items-center gap-2"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered rounded-md"
          type="text"
          placeholder="Search..."
        />
        <button type="submit" className="btn bg-zinc-700 text-white">
          <BiSearchAlt2 className="w-6 h-6 outline-none" />
        </button>
      </form>
      <div className="divider px-3"></div>
      <CustomerCares />
      {/* <div className="mt-2">
        <button onClick={logoutHandler} className="btn btn-sm">
          Logout
        </button>
      </div> */}
    </div>
  );
};

export default Sidebar;
