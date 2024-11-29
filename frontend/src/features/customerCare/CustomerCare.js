import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCustomerCare } from "./customerCareSlice";
import { RxAvatar } from "react-icons/rx";

const CustomerCare = ({ user }) => {
  const dispatch = useDispatch();
  const { selectedCustomerCare = {}, onlineUsers } = useSelector(
    (store) => store.customerCare
  );
  const isOnline = onlineUsers?.includes(user._id);
  const selectedUserHandler = (user) => {
    dispatch(setSelectedCustomerCare(user));
  };
  return (
    <>
      <div
        onClick={() => selectedUserHandler(user)}
        className={` ${
          selectedCustomerCare?.id === user?.id
            ? "bg-zinc-200 text-black"
            : "text-white"
        } flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-2 cursor-pointer`}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            {user?.profilePhoto ? (
              <img src={user?.profilePhoto} alt="user-profile" />
            ) : (
              <RxAvatar className="h-10 w-10 mr-2 cursor-pointer rounded-full hover:text-gray-400" />
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between gap-2 ">
            <p>{user?.name}</p>
          </div>
        </div>
      </div>
      <div className="divider my-0 py-0 h-1"></div>
    </>
  );
};

export default CustomerCare;
