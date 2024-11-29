// AdminBlogs.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  fetchAllBlogsAsync,
  selectTotalBlogs,
  selectBlogs,
  updateBlogAsync,
  deleteBlogAsync,
} from "../../Blogs/blogsSlice";
import {
  CheckIcon,
  PencilIcon as EditIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Pagination from "../../common/Pagination";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import Modal from "../../common/Modal";
import { Link, useNavigate } from "react-router-dom";
import { selectUserInfo } from "../../user/userSlice";

function AdminBlogs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);

  const totalBlogs = useSelector(selectTotalBlogs);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    _sort: "updatedAt",
    _order: "desc",
  });
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [update, setUpdate] = useState({});
  const [editableBlogId, setEditableBlogId] = useState(-1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [blogToDelete, setBlogToDelete] = useState(null); // State to store blog being deleted

  const blogs = useSelector(selectBlogs);

  const handleEdit = (blog) => {
    navigate(`/admin/blog-form/edit/${blog.id}`, { state: { blog } });

    //   <Link
    //   to="/admin/blog-form"
    //   className="rounded-md mx-10 my-5 bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    // >
    //   Create New Blog
    // </Link>
    // setEditableBlogId(blog.id);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleBlogCategory = (e, blog) => {
    setUpdate({ ...update, category: e.target.value });
  };

  const handleBlogStatus = (e, blog) => {
    setUpdate({ ...update, status: e.target.value });
  };

  const handleSave = (blog) => {
    dispatch(updateBlogAsync({ id: blog.id, ...update }));
    setEditableBlogId(-1);
  };

  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    setSort(sort);
  };

  const handleDelete = (blog) => {
    setBlogToDelete(blog);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (blogToDelete) {
      dispatch(deleteBlogAsync(blogToDelete.id));
      setDeleteModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setBlogToDelete(null);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    const filters = {
      category: selectedCategory.map((cat) => cat.value).join(","),
      status: selectedStatus.map((stat) => stat.value).join(","),
    };

    dispatch(fetchAllBlogsAsync({ sort, filters, pagination }));
  }, [dispatch, page, sort, selectedStatus, selectedCategory, editableBlogId]);

  const statusOptions = [
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
  ];

  const categoryOptions = [
    { value: "tech", label: "Tech" },
    { value: "health", label: "Health" },
    // Add more categories as needed
  ];

  const handleStatusChange = (selectedOptions) => {
    setSelectedStatus(selectedOptions || []);
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategory(selectedOptions || []);
  };

  const isEditable = (blogId) => blogId === editableBlogId;

  return (
    <div className="overflow-x-auto">
      <div className="bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
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
          <div className="bg-white shadow-md rounded my-6 mx-4">
            <div>
              <Link
                onClick={() =>
                  userInfo?.role !== "admin" && navigate("/admin/blog-form")
                }
                className={`rounded-md mx-10 my-5 px-3 py-2 text-sm font-semibold text-white shadow-sm ${
                  userInfo?.role === "admin"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-700 hover:bg-green-500"
                }`}
                disabled={userInfo?.role === "admin"}
              >
                Create New Blog
              </Link>
            </div>
            <table className="w-full table-auto m-4">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-4 text-left cursor-pointer flex justify-start items-center">
                    Title
                  </th>
                  <th className="py-3 px-4 text-left cursor-pointer">Author</th>
                  <th className="py-3 px-4 text-left cursor-pointer">
                    Category
                  </th>
                  <th className="py-3 px-4 text-left cursor-pointer">Status</th>
                  <th className="py-3 px-4 text-left cursor-pointer">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-4 text-left whitespace-nowrap">
                      <div className="">
                        <span className="font-medium">{blog.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-left">{blog.author}</td>
                    <td className="py-3 px-4 text-left">
                      {isEditable(blog.id) ? (
                        <select
                          value={
                            update.category ? update.category : blog.category
                          }
                          onChange={(e) => handleBlogCategory(e, blog)}
                        >
                          {categoryOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="py-1 px-3 rounded-full text-xs">
                          {blog.category}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-left">
                      {isEditable(blog.id) ? (
                        <select
                          value={update.status ? update.status : blog.status}
                          onChange={(e) => handleBlogStatus(e, blog)}
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="py-1 px-3 rounded-full text-xs">
                          {blog.status}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-left">
                      {isEditable(blog.id) ? (
                        <button onClick={() => handleSave(blog)}>
                          <CheckIcon className="w-6 h-6 text-blue-500" />
                        </button>
                      ) : (
                        <div className="flex px-4 gap-10 items-center">
                          <button
                            onClick={() =>
                              userInfo?.role !== "admin" && handleEdit(blog)
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
                              userInfo?.role !== "admin" && handleDelete(blog)
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
        totalItems={totalBlogs}
      ></Pagination>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        message="Are you sure you want to delete this blog?"
        dangerOption="Delete"
        cancelOption="Cancel"
        dangerAction={handleConfirmDelete}
        cancelAction={handleCancelDelete}
        showModal={deleteModalOpen}
      />
    </div>
  );
}

export default AdminBlogs;
