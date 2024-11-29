import React, { useEffect } from "react";
import {
  EnvelopeIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  UserGroupIcon,
  CakeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserByIdAsync,
  selectUser,
  selectUserInfoStatus,
} from "../../user/userSlice";
import { useLocation } from "react-router-dom";
import Loader from "../../common/Loader";

const AdminUserDetails = () => {
  const location = useLocation();
  const userId = location.state.userId;

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userLoading = useSelector(selectUserInfoStatus);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserByIdAsync({ userId }));
    }
  }, [userId]);

  if (userLoading === "loading") {
    return <Loader loading={userLoading === "loading"} />;
  }
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">User Details</h2>
          <PencilSquareIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <UserCircleIcon className="h-6 w-6 mr-2" />
            <span>
              <strong>Name:</strong> {user?.name}
            </span>
          </div>
          <div className="flex items-center">
            <EnvelopeIcon className="h-6 w-6 mr-2" />
            <span>
              <strong>Email:</strong> {user?.email}
            </span>
          </div>
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-6 w-6 mr-2" />
            <span>
              <strong>Company Name:</strong> {user?.company_name}
            </span>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="h-6 w-6 mr-2" />
            <span>
              <strong>Phone Number:</strong> {user?.phone_number}
            </span>
          </div>
          <div className="flex items-center">
            <UserGroupIcon className="h-6 w-6 mr-2" />
            <span>
              <strong>Role:</strong> {user?.role}
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 mr-2" />
            <span>
              <strong>User Category:</strong> {user?.user_category}
            </span>
          </div>
          <div className="flex items-center">
            {user?.user_status === "active" ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-500 mr-2" />
            )}
            <span>
              <strong>User Status:</strong> {user?.user_status}
            </span>
          </div>
          <div className="flex items-center">
            <CakeIcon className="h-6 w-6 mr-2" />
            <span>
              <strong>Date of Birth:</strong>{" "}
              {new Date(user?.date_of_birth).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <UserCircleIcon className="h-6 w-6 mr-2" />
            <span>
              <strong>Gender:</strong> {user?.gender}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <strong>Address:</strong>
          <ul className="list-disc list-inside ml-4">
            {user?.addresses?.map((address, index) => (
              <li key={index}>
                {address.name}, {address.street}, {address.city},{address.state}
                , {address.pinCode},<div>Phone Number: {address.phone}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <div>
            <strong>Created At:</strong>{" "}
            {new Date(user?.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Updated At:</strong>{" "}
            {new Date(user?.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
