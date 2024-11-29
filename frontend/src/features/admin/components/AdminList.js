import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  fetchAllUsersAsync,
  selectTotalUsers,
  selectUsers,
  updateUserAsync,
} from "../../user/userSlice";
import { CheckIcon, PencilIcon as EditIcon } from "@heroicons/react/24/outline";
// import Pagination from "../../common/Pagination";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import { Pagination } from "antd";

function AdminList() {
  const dispatch = useDispatch();
  const totalUsers = useSelector(selectTotalUsers);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);

  const [sort, setSort] = useState({});
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [update, setUpdate] = useState({});

  const users = useSelector(selectUsers);
  const [editableUserId, setEditableUserId] = useState(-1);

  const onShowSizeChange = (current, size) => {
    setPageSize(size);
  };

  const handleEdit = (user) => {
    setEditableUserId(user.id);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleUserCategory = (e, user) => {
    setUpdate({ ...update, user_category: e.target.value });
    // dispatch(updateUserAsync(update));
    // setEditableUserId(-1);
  };

  const handleUserStatus = (e, user) => {
    setUpdate({ ...update, user_status: e.target.value });

    // dispatch(updateUserAsync(updatedUser));
    // setEditableUserId(-1);
  };

  const handleSave = (user) => {
    dispatch(updateUserAsync({ id: user.id, ...update }));

    setEditableUserId(-1);
  };

  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    setSort(sort);
  };

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

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    const filters = {
      user_category: selectedCategory.map((cat) => cat.value).join(","),
      user_status: selectedStatus.map((stat) => stat.value).join(","),
    };
    dispatch(fetchAllUsersAsync({ sort, ...filters, pagination }));
  }, [dispatch, page, sort, selectedStatus, selectedCategory, editableUserId]);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const categoryOptions = [
    { value: "regular", label: "Regular" },
    { value: "gold", label: "Gold" },
    { value: "silver", label: "Silver" },
  ];

  const handleStatusChange = (selectedOptions) => {
    setSelectedStatus(selectedOptions || []);
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategory(selectedOptions || []);
  };

  const isEditable = (userId) => userId === editableUserId;

  return (
    <div className="">
      <div className="bg-gray-100 flex items-center justify-center font-sans overflow-auto">
        <div className="w-full">
          <div className="flex space-x-4 p-4 bg-white shadow-md rounded my-6">
            <Select
              isMulti
              options={statusOptions}
              value={selectedStatus}
              onChange={handleStatusChange}
              placeholder="Filter by Status"
              className="w-1/2"
            />
            <Select
              isMulti
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Filter by Category"
              className="w-1/2"
            />
          </div>
          <div className="bg-white shadow-md rounded my-6">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-0 text-left cursor-pointer">Name</th>
                  <th className="py-3 px-0 text-left cursor-pointer">
                    Address
                  </th>
                  <th className="py-3 px-0 text-left cursor-pointer">Email</th>
                  <th className="py-3 px-0 text-left cursor-pointer">
                    Phone Number
                  </th>
                  <th className="py-3 px-0 text-left cursor-pointer">
                    Category
                  </th>
                  <th className="py-3 px-0 text-left cursor-pointer">Status</th>
                  <th className="py-3 px-0 text-left cursor-pointer">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-0 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2"></div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-0 text-left">
                      <div className="flex flex-col">
                        {user.addresses.map((address, index) => (
                          <div key={index} className="mb-1">
                            {address.street}, {address.city}, {address.state},{" "}
                            {address.pinCode}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-0 text-left">{user.email}</td>
                    <td className="py-3 px-0 text-left">{user.phone_number}</td>
                    <td className="py-3 px-0 text-left">
                      {isEditable(user.id) ? (
                        <select
                          value={
                            update.user_category
                              ? update.user_category
                              : user.user_category
                          }
                          onChange={(e) => handleUserCategory(e, user)}
                        >
                          <option value="regular">Regular</option>
                          <option value="gold">Gold</option>
                          <option value="silver">Silver</option>
                        </select>
                      ) : (
                        <span
                          className={`${chooseColor(
                            user.user_category
                          )} py-1 px-3 rounded-full text-xs`}
                        >
                          {user.user_category}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-0 text-left">
                      {isEditable(user.id) ? (
                        <select
                          value={
                            update.user_status
                              ? update.user_status
                              : user.user_status
                          }
                          onChange={(e) => handleUserStatus(e, user)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      ) : (
                        <span
                          className={`${chooseColor(
                            user.user_status
                          )} py-1 px-3 rounded-full text-xs`}
                        >
                          {user.user_status}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-0 text-left">
                      {isEditable(user.id) ? (
                        <button onClick={() => handleSave(user)}>
                          <CheckIcon className="w-6 h-6 text-blue-500" />
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(user)}>
                          <EditIcon className="w-6 h-6 text-blue-500" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Pagination
        showSizeChanger={true}
        onShowSizeChange={onShowSizeChange}
        defaultCurrent={page}
        total={totalUsers}
        pageSize={pageSize}
        onChange={(page) => setPage(page)}
      />
    </div>
  );
}

export default AdminList;
