import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import Select from "react-select";
import { CheckIcon, PencilIcon } from "@heroicons/react/24/outline";

import {
  fetchNewUserRequestByIdAsync,
  fetchNewUserRequestsAsync,
  selectNewUserRequest,
  selectNewUserRequests,
  selectNewUserRequestsStatus,
} from "./newUserRequestsSlice";
// import Pagination from "../../common/Pagination";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import { updateUserAsync } from "../../user/userSlice";
import { Pagination } from "antd";
import Loader from "../../common/Loader";

Modal.setAppElement("#root"); // Set the root element for accessibility

function AdminNewUserRequests() {
  const dispatch = useDispatch();
  const newUserRequests = useSelector(selectNewUserRequests);
  const newUserRequest = useSelector(selectNewUserRequest);
  const newUserRequestLoader = useSelector(selectNewUserRequestsStatus);
  const status = useSelector(selectNewUserRequestsStatus);
  const [page, setPage] = useState(1);
  const [selectedUserRequest, setSelectedUserRequest] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userStatus, setUserStatus] = useState("");
  const [userCategory, setUserCategory] = useState("");

  const handlePage = (page) => {
    setPage(page);
  };

  const handleRowClick = (request) => {
    setSelectedUserRequest(request);
    setUserStatus(request?.user?.user_status);
    setUserCategory(request.user?.user_category);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUserRequest(null);
    setIsEditMode(false);
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleStatusChange = (selectedOption) => {
    setUserStatus(selectedOption.value);
  };

  const handleCategoryChange = (selectedOption) => {
    setUserCategory(selectedOption.value);
  };

  const handleSave = (selectedUserRequest) => {
    dispatch(
      updateUserAsync({
        id: selectedUserRequest.user.id,
        user_status: userStatus,
        user_category: userCategory,
      })
    );
    fetchNewUserRequestsData();
    setIsEditMode(false);
  };

  // useEffect(() => {
  //   const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
  //   dispatch(
  //     fetchNewUserRequestsAsync({
  //       pagination,
  //       sort: {},
  //       request_type: "",
  //       request_status: "",
  //       user: "",
  //     })
  //   );
  // }, [dispatch, page]);

  const fetchNewUserRequestsData = () => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(
      fetchNewUserRequestsAsync({
        pagination,
        sort: {},
        request_type: "",
        request_status: "",
        user: "",
      })
    );
  };

  useEffect(() => {
    fetchNewUserRequestsData();
  }, [dispatch, page]);

  useEffect(() => {
    if (selectedUserRequest) {
      dispatch(fetchNewUserRequestByIdAsync({ id: selectedUserRequest.id }));
    }
  }, [selectedUserRequest, dispatch]);
  const chooseColor = (status) => {
    switch (status) {
      case "regular":
        return "bg-blue-200 text-blue-600";
      case "gold":
        return "bg-yellow-200 text-yellow-600";
      case "silver":
        return "bg-gray-200 text-gray-600";
      case "active":
        return "bg-green-200 text-green-600";
      case "inactive":
        return "bg-red-200 text-red-600";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="bg-gray-100 flex items-center justify-center font-sans overflow-auto">
        <div className="w-full">
          {status === "loading" ? (
            <div>
              <Loader />
            </div>
          ) : status === "failed" ? (
            <div>Error loading user requests</div>
          ) : (
            <>
              <div className="bg-white shadow-md rounded my-6">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-0 text-left cursor-pointer">
                        User ID
                      </th>
                      <th className="py-3 px-0 text-left cursor-pointer">
                        User Name
                      </th>
                      <th className="py-3 px-0 text-left cursor-pointer">
                        User Phone Number
                      </th>
                      <th className="py-3 px-0 text-left cursor-pointer">
                        User GST Number
                      </th>
                      <th className="py-3 px-0 text-left cursor-pointer">
                        Request Status
                      </th>
                      <th className="py-3 px-0 text-left cursor-pointer">
                        User Status
                      </th>
                      <th className="py-3 px-0 text-left cursor-pointer">
                        Request Type
                      </th>
                      {/* <th className="py-3 px-0 text-left cursor-pointer">
                        Admin Notes
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {newUserRequests &&
                      newUserRequests?.map((request) => (
                        <tr
                          key={request._id}
                          className={`border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${
                            request.seen ? "" : "bg-gray-50 font-bold"
                          }`}
                          onClick={() => handleRowClick(request)}
                        >
                          <td className="py-3 px-0 text-left whitespace-nowrap">
                            {request?.id}
                          </td>
                          <td className="py-3 px-0 text-left">
                            {request?.user?.name}
                          </td>
                          <td className="py-3 px-0 text-left">
                            {request?.user?.phone_number}
                          </td>
                          <td className="py-3 px-0 text-left">
                            {request?.user?.gst_number || "NA"}
                          </td>
                          <td className="py-3 px-0 text-left">
                            {request?.request_status}
                          </td>
                          <td className="py-3 px-0 text-left">
                            {request?.user?.user_status}
                          </td>
                          <td className="py-3 px-0 text-left">
                            {request?.request_type}
                          </td>
                          {/* <td className="py-3 px-0 text-left">
                          {request?.admin_notes}
                        </td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={page}
                setPage={setPage}
                handlePage={handlePage}
                totalItems={newUserRequests?.length}
              />
            </>
          )}
        </div>
        {selectedUserRequest && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="User Information"
            className="bg-white shadow-md rounded p-6 mx-auto my-6 w-1/2 relative"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
              onClick={closeModal}
            >
              &times;
            </button>
            {}
            {newUserRequestLoader === "loading" ? (
              <Loader />
            ) : (
              <>
                {newUserRequest && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-center">
                      User Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-100 p-4 rounded shadow">
                        <p className="font-semibold">User ID:</p>
                        <p>{newUserRequest.user?.id}</p>
                      </div>
                      <div className="bg-gray-100 p-4 rounded shadow">
                        <p className="font-semibold">Name:</p>
                        <p>{newUserRequest.user?.name}</p>
                      </div>
                      <div className="bg-gray-100 p-4 rounded shadow">
                        <p className="font-semibold">Email:</p>
                        <p>{newUserRequest.user?.email}</p>
                      </div>
                      <div className="bg-gray-100 p-4 rounded shadow">
                        <p className="font-semibold">Phone:</p>
                        <p>{newUserRequest.user?.phone_number}</p>
                      </div>
                      <div className="bg-gray-100 p-4 rounded shadow">
                        <p className="font-semibold">GST Number:</p>
                        <p>{newUserRequest.user?.gst_number || "NA"}</p>
                      </div>
                      <div
                        className={`${chooseColor(
                          userStatus
                        )} p-4 rounded shadow`}
                      >
                        <p className="font-semibold">User Status:</p>
                        {isEditMode ? (
                          <Select
                            value={{ label: userStatus, value: userStatus }}
                            onChange={handleStatusChange}
                            options={[
                              { label: "Active", value: "active" },
                              { label: "Inactive", value: "inactive" },
                            ]}
                          />
                        ) : (
                          <p>{userStatus}</p>
                        )}
                      </div>
                      <div
                        className={`${chooseColor(
                          userCategory
                        )} p-4 rounded shadow`}
                      >
                        <p className="font-semibold">User Category:</p>
                        {isEditMode ? (
                          <Select
                            value={{
                              label: userCategory,
                              value: userCategory,
                            }}
                            onChange={handleCategoryChange}
                            options={[
                              { label: "Regular", value: "regular" },
                              { label: "Gold", value: "gold" },
                              { label: "Silver", value: "silver" },
                              { label: "Platinum", value: "platinum" },
                            ]}
                          />
                        ) : (
                          <p>{userCategory}</p>
                        )}
                      </div>
                      {/* Additional user details */}
                    </div>
                    {isEditMode ? (
                      <button
                        className="absolute bottom-4 right-4 p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                        onClick={() => handleSave(selectedUserRequest)}
                      >
                        {/* <i className="fas fa-check"></i> */}
                        <CheckIcon className="w-6 h-6" />
                      </button>
                    ) : (
                      <button
                        className="absolute bottom-4 right-4 p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                        onClick={handleEditClick}
                      >
                        {/* <i className="fas fa-pencil-alt"></i> */}
                        <PencilIcon className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </Modal>
        )}
      </div>
    </div>
  );
}

export default AdminNewUserRequests;
