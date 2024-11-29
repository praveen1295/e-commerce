import React, { useEffect } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useSelector, useDispatch } from "react-redux";
import { selectLoggedInUser } from "../auth/authSlice";
import { RxAvatar } from "react-icons/rx";
// import { setSelectedCustomerCare } from "../redux/userSlice";

const MessageContainer = () => {
  const authUser = useSelector(selectLoggedInUser);

  const { selectedCustomerCare, onlineUsers } = useSelector(
    (store) => store.customerCare
  );
  const dispatch = useDispatch();

  const isOnline = onlineUsers?.includes(selectedCustomerCare?._id);
  console.log("selectedUserselectedUser", selectedCustomerCare);
  return (
    <>
      {selectedCustomerCare ? (
        <div className="md:min-w-[550px] flex flex-col">
          <div className="flex gap-2 items-center bg-zinc-800 text-white px-4 py-2 mb-2">
            <div className={`avatar ${isOnline ? "online" : ""}`}>
              <div className="w-12 rounded-full">
                {selectedCustomerCare?.profilePhoto ? (
                  <img
                    src={selectedCustomerCare?.profilePhoto}
                    alt="user-profile"
                  />
                ) : (
                  <RxAvatar className="h-10 w-10 mr-2 cursor-pointer rounded-full hover:text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between gap-2">
                <p>{selectedCustomerCare?.name}</p>
              </div>
            </div>
          </div>
          <Messages />
          <SendInput />
        </div>
      ) : (
        <div className="md:min-w-[550px] flex flex-col justify-center items-center">
          <h1 className="text-4xl text-white font-bold">
            Hi,{authUser?.fullName}{" "}
          </h1>
          <h1 className="text-2xl text-white">Let's start conversation</h1>
        </div>
      )}
    </>
  );
};

export default MessageContainer;
