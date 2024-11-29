import React, { useEffect } from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser } from "../auth/authSlice";
import { RxAvatar } from "react-icons/rx";
import { fetchAllUsersAsync, selectUsers } from "../user/userSlice";
import { ITEMS_PER_PAGE } from "../../app/constants";
import { setSelectedCustomerCare } from "../customerCare/customerCareSlice";

const MessageContainer = () => {
  const dispatch = useDispatch();
  const customerCares = useSelector(selectUsers);

  const authUser = useSelector(selectLoggedInUser);
  const { selectedCustomerCare, onlineUsers } = useSelector(
    (store) => store.customerCare
  );

  const isOnline = onlineUsers?.includes(selectedCustomerCare?.id);

  useEffect(() => {
    const pagination = { _page: 1, _limit: ITEMS_PER_PAGE };

    dispatch(
      fetchAllUsersAsync({
        role: authUser.role === "customerCare" ? "user" : "customerCare",
        pagination,
      })
    );
  }, []);

  useEffect(() => {
    if (authUser?.role === "user")
      dispatch(setSelectedCustomerCare(customerCares[0]));
  }, [customerCares]);

  return (
    <>
      {selectedCustomerCare ? (
        <div className="flex flex-col md:min-w-[550px] bg-gray-900 rounded-lg shadow-lg h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <div className={`avatar ${isOnline ? "online" : ""}`}>
              <div className="w-12 rounded-full">
                {selectedCustomerCare?.profilePhoto ? (
                  <img
                    src={selectedCustomerCare?.profilePhoto}
                    alt="user-profile"
                  />
                ) : (
                  <RxAvatar className="h-10 w-10" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {selectedCustomerCare?.name}
              </h2>
              {/* <p className="text-sm text-gray-200">
                {isOnline ? "Online" : "Offline"}
              </p> */}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-800">
            <Messages />
          </div>

          {/* Input */}
          <div className="p-4 bg-gray-700">
            <SendInput />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full bg-gray-900 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hi, {authUser?.name}
          </h1>
          <p className="text-xl text-gray-300">Let's start a conversation!</p>
        </div>
      )}
    </>
  );
};

export default MessageContainer;
