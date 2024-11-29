import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBannersAsync,
  selectTotalBanners,
  selectBanners,
  updateBannerAsync,
  deleteBannerAsync,
} from "../../Banners/bannersSlice";
import {
  CheckIcon,
  PencilIcon as EditIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Pagination from "../../common/Pagination";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import Modal from "../../common/Modal";
import { Link } from "react-router-dom";
import AdminBannerForm from "./AdminBanerForm";
import { selectUserInfo } from "../../user/userSlice";

function AdminBanners() {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const totalBanners = useSelector(selectTotalBanners);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    _sort: "updatedAt",
    _order: "desc",
  });
  const [update, setUpdate] = useState({});
  const [editableBannerId, setEditableBannerId] = useState(-1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [bannerForm, setBannerForm] = useState(false);

  const banners = useSelector(selectBanners);

  const handleEdit = (banner) => {
    setEditableBannerId(banner.id);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleBannerStatus = (e, banner) => {
    setUpdate({ ...update, status: e.target.value });
  };

  const handleSave = (banner) => {
    dispatch(updateBannerAsync({ id: banner.id, ...update }));
    setEditableBannerId(-1);
  };

  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    setSort(sort);
  };

  const handleDelete = (banner) => {
    setBannerToDelete(banner);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (bannerToDelete) {
      dispatch(deleteBannerAsync(bannerToDelete.id));
      setDeleteModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setBannerToDelete(null);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchAllBannersAsync({ sort, pagination }));
  }, [dispatch, page, sort, editableBannerId]);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "deleted", label: "Deleted" },
  ];

  const isEditable = (bannerId) => bannerId === editableBannerId;

  return (
    <>
      {!bannerForm ? (
        <div className="overflow-x-auto px-4 sm:px-6 lg:px-8 mt-7">
          <div className="bg-gray-100 flex flex-col items-center justify-center font-sans overflow-hidden">
            <div className="w-full max-w-7xl">
              <div>
                <Link
                  to={userInfo?.role !== "admin" ? "/admin/banner-form" : "#"}
                  className={`rounded-md mx-4 my-5 px-3 py-2 text-sm font-semibold text-white shadow-sm ${
                    userInfo?.role === "admin"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-700 hover:bg-green-500"
                  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                  onClick={(e) => {
                    if (userInfo?.role === "admin") {
                      e.preventDefault(); // Prevents the link action if the user is an admin
                    } else {
                      setBannerForm(true);
                    }
                  }}
                >
                  Create New Banner
                </Link>
              </div>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-4 text-left">Title</th>
                      <th className="py-3 px-4 text-left">Description</th>
                      <th className="py-3 px-4 text-left">Image</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {banners.map((banner) => (
                      <tr
                        key={banner.id}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="py-3 px-4 text-left whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="font-medium">{banner.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-left">
                          {banner.description}
                        </td>
                        <td className="py-3 px-4 text-left">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-20 h-20 object-cover"
                          />
                        </td>
                        <td className="py-3 px-4 text-left">
                          {isEditable(banner.id) ? (
                            <select
                              value={
                                update.status ? update.status : banner.status
                              }
                              onChange={(e) => handleBannerStatus(e, banner)}
                              className="form-select mt-1 block w-full"
                            >
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="py-1 px-3 rounded-full text-xs bg-gray-200">
                              {banner.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-left">
                          {isEditable(banner.id) ? (
                            <button onClick={() => handleSave(banner)}>
                              <CheckIcon className="w-6 h-6 text-blue-500" />
                            </button>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  userInfo?.role !== "admin" &&
                                  handleEdit(banner)
                                }
                                className={`w-6 h-6 ${
                                  userInfo?.role === "admin"
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-blue-500"
                                }`}
                                disabled={userInfo?.role === "admin"}
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() =>
                                  userInfo?.role !== "admin" &&
                                  handleDelete(banner)
                                }
                                className={`w-6 h-6 ${
                                  userInfo?.role === "admin"
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-blue-500"
                                }`}
                                disabled={userInfo?.role === "admin"}
                              >
                                <TrashIcon />
                              </button>
                            </div>
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
            page={page}
            setPage={setPage}
            handlePage={handlePage}
            totalItems={totalBanners}
          ></Pagination>

          {/* Delete Confirmation Modal */}
          <Modal
            title="Confirm Delete"
            message="Are you sure you want to delete this banner?"
            dangerOption="Delete"
            cancelOption="Cancel"
            dangerAction={handleConfirmDelete}
            cancelAction={handleCancelDelete}
            showModal={deleteModalOpen}
          />
        </div>
      ) : (
        <AdminBannerForm></AdminBannerForm>
      )}
    </>
  );
}

export default AdminBanners;
