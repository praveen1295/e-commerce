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
  selectColors,
  updateColorAsync,
  fetchAllColorsAsync,
  selectTotalColors,
  deleteColorAsync,
  selectColorStatus,
  createColorAsync,
} from "./colorSlice";
import { ITEMS_PER_PAGE } from "../../app/constants";
import toast from "react-hot-toast";

const ColorModal = ({ btnText, btnStyle, btnDisabled }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const colorLoader = useSelector(selectColorStatus);
  const totalColors = useSelector(selectTotalColors);
  const colors = useSelector(selectColors);

  const [showNewColorInput, setShowNewColorInput] = useState(false);
  const [newColor, setNewColor] = useState({ label: "", value: "" });

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    _sort: "updatedAt",
    _order: "desc",
  });
  const [update, setUpdate] = useState({});
  const [editableColorDetailId, setEditableColorDetailId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState(null);

  const handleEdit = (color) => {
    setEditableColorDetailId(color.id);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleColorFieldChange = (e, field) => {
    setUpdate({ ...update, [field]: e.target.value });
  };

  const handleSave = (color) => {
    dispatch(updateColorAsync({ id: color.id, ...update }));
    setEditableColorDetailId(null);
    setUpdate({});
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleSort = (sortOption) => {
    setSort({ _sort: sortOption.sort, _order: sortOption.order });
  };

  const handleDelete = (color) => {
    setColorToDelete(color);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (colorToDelete) {
      dispatch(deleteColorAsync(colorToDelete.id));
      setDeleteModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setColorToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleNewColor = () => {
    if (!newColor.label || !newColor.value) {
      toast.error("Colors name and value are require.");
      return;
    }
    dispatch(createColorAsync({ ...newColor, checked: false }));
    dispatch(fetchAllColorsAsync());
    setShowNewColorInput(false);
    setNewColor({ label: "", value: "" });
  };

  useEffect(() => {
    dispatch(fetchAllColorsAsync());
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
            Enter Color Information
          </h2>
        }
        centered
        open={open}
        confirmLoading={colorLoader === "loading"}
        footer={false}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        {colorLoader === "loading" ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto relative">
            <div className="bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
              <div className="w-full">
                <div className="bg-white shadow-md rounded my-6">
                  <div className="flex gap-4 items-center">
                    <Link
                      onClick={() => setShowNewColorInput(!showNewColorInput)}
                      className="rounded-md mx-10 my-5 bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                    >
                      Create New Color
                    </Link>
                    {showNewColorInput && (
                      <div className="flex gap-2 h-12">
                        <input
                          type="text"
                          value={newColor.label}
                          placeholder="Enter new color..."
                          onChange={(e) =>
                            setNewColor({
                              ...newColor,
                              label: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          value={newColor.value}
                          placeholder="Enter new color value..."
                          onChange={(e) =>
                            setNewColor({
                              ...newColor,
                              value: e.target.value,
                            })
                          }
                        />
                        <CommonButton
                          buttonClick={handleNewColor}
                          text="Save"
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
                          Color
                        </th>
                        <th className="py-3 px-0 text-left cursor-pointer">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {colors &&
                        colors.map((color, idx) => (
                          <tr
                            key={color.id}
                            className="border-b border-gray-200 hover:bg-gray-100"
                          >
                            <td className="py-3 px-0 text-left whitespace-nowrap">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-0 text-left whitespace-nowrap">
                              {editableColorDetailId === color.id ? (
                                <>
                                  <input
                                    type="text"
                                    value={update.label || color.label}
                                    placeholder="Enter color name..."
                                    onChange={(e) =>
                                      handleColorFieldChange(e, "label")
                                    }
                                  />{" "}
                                  <input
                                    type="text"
                                    value={update.value || color.value}
                                    placeholder="Enter color value..."
                                    onChange={(e) =>
                                      handleColorFieldChange(e, "value")
                                    }
                                  />
                                </>
                              ) : (
                                color.label
                              )}
                            </td>
                            <td className="py-3 px-0 text-left">
                              {editableColorDetailId === color.id ? (
                                <button onClick={() => handleSave(color)}>
                                  <CheckIcon className="w-6 h-6 text-blue-500" />
                                </button>
                              ) : (
                                <div className="flex gap-10 items-center">
                                  <button onClick={() => handleEdit(color)}>
                                    <EditIcon className="w-6 h-6 text-blue-500" />
                                  </button>

                                  <>
                                    <TrashIcon
                                      onClick={() => handleDelete(color)}
                                      className="w-6 h-6 text-blue-500 cursor-pointer"
                                    />
                                    <Modal
                                      title="Are you sure you want to delete this color?"
                                      open={deleteModalOpen}
                                      onOk={handleConfirmDelete}
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
              total={totalColors}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default ColorModal;
