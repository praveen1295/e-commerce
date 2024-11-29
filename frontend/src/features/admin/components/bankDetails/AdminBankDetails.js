// AdminBankDetails.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBankDetailsAsync,
  selectTotalBankDetails,
  selectBankDetails,
  updateBankDetailAsync,
  deleteBankDetailAsync,
} from "../../../bankDetails/bankDetailsSlice";
import {
  CheckIcon,
  PencilIcon as EditIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Pagination from "../../../common/Pagination";
import { ITEMS_PER_PAGE } from "../../../../app/constants";
import Modal from "../../../common/Modal";
import { Link, useNavigate } from "react-router-dom";
import { selectUserInfo } from "../../../user/userSlice";
const bankDetails = [
  {
    bankName: "State Bank of India",
    accountNumber: "123456789012",
    ifscCode: "SBIN0000001",
    accountHolderName: "John Doe",
    createdBy: "user1",
  },
  {
    bankName: "HDFC Bank",
    accountNumber: "987654321098",
    ifscCode: "HDFC0001234",
    accountHolderName: "Jane Doe",
    createdBy: "user2",
  },
  {
    bankName: "ICICI Bank",
    accountNumber: "112233445566",
    ifscCode: "ICIC0005678",
    accountHolderName: "Alice Smith",
    createdBy: "user3",
  },
];
function AdminBankDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);

  const totalBankDetails = useSelector(selectTotalBankDetails);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    _sort: "updatedAt",
    _order: "desc",
  });
  const [update, setUpdate] = useState({});
  const [editableBankDetailId, setEditableBankDetailId] = useState(-1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bankDetailToDelete, setBankDetailToDelete] = useState(null);

  const bankDetails = useSelector(selectBankDetails);

  const handleEdit = (bankDetail) => {
    navigate(`/admin/bank-detail-form/edit/${bankDetail?.id}`, {
      state: { bankDetail },
    });
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleBankDetailFieldChange = (e, field) => {
    setUpdate({ ...update, [field]: e.target.value });
  };

  const handleSave = (bankDetail) => {
    dispatch(updateBankDetailAsync({ id: bankDetail.id, ...update }));
    setEditableBankDetailId(-1);
  };

  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    setSort(sort);
  };

  const handleDelete = (bankDetail) => {
    setBankDetailToDelete(bankDetail);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (bankDetailToDelete) {
      dispatch(deleteBankDetailAsync(bankDetailToDelete.id));
      setDeleteModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setBankDetailToDelete(null);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchAllBankDetailsAsync({ sort, pagination }));
  }, [dispatch, page, sort, editableBankDetailId]);

  return (
    <div className="overflow-x-auto">
      <div className="bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
        <div className="w-full">
          <div className="bg-white shadow-md rounded my-6">
            <div>
              <Link
                to={
                  userInfo?.role === "admin" ? "#" : "/admin/bank-detail-form"
                }
                className={`rounded-md mx-10 my-5 px-3 py-2 text-sm font-semibold text-white shadow-sm 
    ${
      userInfo?.role === "admin"
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-700 hover:bg-green-500"
    }`}
                onClick={(e) =>
                  userInfo?.role === "admin" && e.preventDefault()
                }
              >
                Create New Bank Detail
              </Link>
            </div>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-0 text-left cursor-pointer">
                    Bank Name
                  </th>
                  <th className="py-3 px-0 text-left cursor-pointer">
                    Account Number
                  </th>
                  <th className="py-3 px-0 text-left cursor-pointer">
                    IFSC Code
                  </th>
                  <th className="py-3 px-0 text-left cursor-pointer">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {console.log(bankDetails, "bankDetails")}
                {bankDetails &&
                  bankDetails.map((bankDetail) => (
                    <tr
                      key={bankDetail.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-0 text-left whitespace-nowrap">
                        {editableBankDetailId === bankDetail.id ? (
                          <input
                            type="text"
                            value={update.bankName || bankDetail.bankName}
                            onChange={(e) =>
                              handleBankDetailFieldChange(e, "bankName")
                            }
                          />
                        ) : (
                          bankDetail.bankName
                        )}
                      </td>
                      <td className="py-3 px-0 text-left whitespace-nowrap">
                        {editableBankDetailId === bankDetail.id ? (
                          <input
                            type="text"
                            value={
                              update.accountNumber || bankDetail.accountNumber
                            }
                            onChange={(e) =>
                              handleBankDetailFieldChange(e, "accountNumber")
                            }
                          />
                        ) : (
                          bankDetail.accountNumber
                        )}
                      </td>
                      <td className="py-3 px-0 text-left whitespace-nowrap">
                        {editableBankDetailId === bankDetail.id ? (
                          <input
                            type="text"
                            value={update.ifscCode || bankDetail.ifscCode}
                            onChange={(e) =>
                              handleBankDetailFieldChange(e, "ifscCode")
                            }
                          />
                        ) : (
                          bankDetail.ifscCode
                        )}
                      </td>
                      <td className="py-3 px-0 text-left">
                        {editableBankDetailId === bankDetail.id ? (
                          <button onClick={() => handleSave(bankDetail)}>
                            <CheckIcon className="w-6 h-6 text-blue-500" />
                          </button>
                        ) : (
                          <div className="flex gap-10 items-center">
                            <button
                              onClick={() =>
                                userInfo?.role !== "admin" &&
                                handleEdit(bankDetail)
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

                            <button onClick={() => handleDelete(bankDetail)}>
                              <TrashIcon className="w-6 h-6 text-blue-500" />
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
        totalItems={totalBankDetails}
      />
      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        message="Are you sure you want to delete this bank detail?"
        dangerOption="Delete"
        cancelOption="Cancel"
        dangerAction={handleConfirmDelete}
        cancelAction={handleCancelDelete}
        showModal={deleteModalOpen}
      />
    </div>
  );
}

export default AdminBankDetails;
