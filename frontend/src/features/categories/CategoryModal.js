import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Pagination } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckIcon,
  TrashIcon,
  PencilIcon as EditIcon,
} from "@heroicons/react/24/outline";
import CommonButton from "../common/CommonButton";
import Loader from "../common/Loader";
import CommonModal from "../common/Modal";
import {
  selectCategories,
  updateCategoryAsync,
  fetchAllCategoriesAsync,
  selectTotalCategories,
  deleteCategoryAsync,
  selectCategoryStatus,
  createCategoryAsync,
} from "./categorySlice";
import { ITEMS_PER_PAGE } from "../../app/constants";
import toast from "react-hot-toast";

const CategoryModal = ({ btnText, btnStyle, btnDisabled }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoryLoader = useSelector(selectCategoryStatus);
  const totalCategories = useSelector(selectTotalCategories);
  const categories = useSelector(selectCategories);

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState({ label: "", value: "" });

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    _sort: "updatedAt",
    _order: "desc",
  });
  const [update, setUpdate] = useState({});
  const [editableCategoryDetailId, setEditableCategoryDetailId] =
    useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleEdit = (category) => {
    setEditableCategoryDetailId(category.id);
    // navigate(`/admin/category-form/edit/${category.id}`, {
    //   state: { category },
    // });
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleCategoryFieldChange = (e, field) => {
    setUpdate({ ...update, [field]: e.target.value });
  };

  const handleSave = (category) => {
    dispatch(updateCategoryAsync({ id: category.id, ...update }));
    setEditableCategoryDetailId(null);
    setUpdate({});
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleSort = (sortOption) => {
    setSort({ _sort: sortOption.sort, _order: sortOption.order });
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategoryAsync(categoryToDelete.id));
      setDeleteModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setCategoryToDelete(null);
    setDeleteModalOpen(false);
  };
  const handleNewCategory = () => {
    if (!newCategory.label || !newCategory.value) {
      toast.error("Colors name and value are require.");
      return;
    }
    dispatch(createCategoryAsync({ ...newCategory, checked: false }));
    dispatch(fetchAllCategoriesAsync());
    setNewCategory({ label: "", value: "" });
  };

  useEffect(() => {
    dispatch(fetchAllCategoriesAsync());
  }, [dispatch]);

  return (
    <>
      <CommonButton
        buttonClick={showModal}
        text={btnText}
        type="button"
        className={`rounded-full ${btnStyle}`}
        disabled={btnDisabled}
      />
      <Modal
        title={
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Enter Order Stage Information
          </h2>
        }
        centered
        open={open}
        confirmLoading={categoryLoader === "loading"}
        footer={false}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        {categoryLoader === "loading" ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto relative">
            <div className="bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
              <div className="w-full">
                <div className="bg-white shadow-md rounded my-6">
                  <div className="flex gap-4 items-center">
                    <Link
                      onClick={() =>
                        setShowNewCategoryInput(!showNewCategoryInput)
                      }
                      className="rounded-md mx-10 my-5 bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                    >
                      Create New Category
                    </Link>
                    {showNewCategoryInput && (
                      <div className="flex gap-2 h-12">
                        <input
                          type="text"
                          value={newCategory.label}
                          placeholder="enter new category..."
                          onChange={(e) =>
                            setNewCategory({
                              ...newCategory,
                              label: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          value={newCategory.value}
                          placeholder="enter new category value..."
                          onChange={(e) =>
                            setNewCategory({
                              ...newCategory,
                              value: e.target.value,
                            })
                          }
                        />
                        <CommonButton
                          buttonClick={handleNewCategory}
                          text="save"
                          type={"button"}
                        />
                      </div>
                    )}
                  </div>
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-0 text-left cursor-pointer">
                          S. No.
                        </th>
                        <th className="py-3 px-0 text-left cursor-pointer">
                          Category
                        </th>
                        <th className="py-3 px-0 text-left cursor-pointer">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {categories &&
                        categories.map((category, idx) => (
                          <tr
                            key={category.id}
                            className="border-b border-gray-200 hover:bg-gray-100"
                          >
                            <td className="py-3 px-0 text-left whitespace-nowrap">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-0 text-left whitespace-nowrap">
                              {editableCategoryDetailId === category.id ? (
                                <>
                                  <input
                                    type="text"
                                    value={update.label || category.label}
                                    placeholder="enter category name..."
                                    onChange={(e) =>
                                      handleCategoryFieldChange(e, "label")
                                    }
                                  />{" "}
                                  <input
                                    type="text"
                                    value={update.value || category.value}
                                    placeholder="enter category value..."
                                    onChange={(e) =>
                                      handleCategoryFieldChange(e, "value")
                                    }
                                  />
                                </>
                              ) : (
                                category.label
                              )}
                            </td>
                            <td className="py-3 px-0 text-left">
                              {editableCategoryDetailId === category.id ? (
                                <button onClick={() => handleSave(category)}>
                                  <CheckIcon className="w-6 h-6 text-blue-500" />
                                </button>
                              ) : (
                                <div className="flex gap-10 items-center">
                                  <button onClick={() => handleEdit(category)}>
                                    <EditIcon className="w-6 h-6 text-blue-500" />
                                  </button>

                                  <>
                                    <TrashIcon
                                      onClick={() => handleDelete(category)}
                                      className="w-6 h-6 text-blue-500 cursor-pointer"
                                    />
                                    <Modal
                                      title="Are you sure you want to delete this category?"
                                      open={deleteModalOpen}
                                      onOk={handleConfirmDelete}
                                      // confirmLoading={confirmLoading}
                                      onCancel={handleCancelDelete}
                                    ></Modal>
                                  </>
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
              current={page}
              onChange={handlePage}
              pageSize={ITEMS_PER_PAGE}
              total={totalCategories}
            />
          </div>
        )}

        <CommonModal
          title="Confirm Delete"
          message="Are you sure you want to delete this category?"
          dangerOption="Delete"
          cancelOption="Cancel"
          dangerAction={handleConfirmDelete}
          cancelAction={handleCancelDelete}
          showModal={deleteModalOpen}
        />
      </Modal>
    </>
  );
};

export default CategoryModal;
