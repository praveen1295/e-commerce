import { useCallback, useEffect, useState } from "react";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersAsync,
  selectOrders,
  selectTotalOrders,
  updateOrderAsync,
} from "../../order/orderSlice";
import {
  PencilIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Pagination } from "antd";
import AdminOrderDetailModal from "./AdminOrderDetailModal";
import { useNavigate } from "react-router-dom";
import CommonButton from "../../common/CommonButton";
import CreateNewOrder from "./AdminCreateOrderForm";
import toast from "react-hot-toast";
import Modal from "../../common/Modal";
import AdminBankDetailsPage from "../../../pages/AdminBankDetails";
import { selectUserInfo } from "../../user/userSlice";
import { debounce } from "../../../utils";

function AdminOrders() {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const totalOrders = useSelector(selectTotalOrders);
  const [selectedOrder, setSelectedOrder] = useState(null); // state for selected order
  const [showBanks, setShowBanks] = useState(false);
  const [showOrderList, setOrderList] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState({
    updateOrderStatus: false,
    updatePaymentStatus: false,
  }); //

  const [editableOrderId, setEditableOrderId] = useState(-1);
  const [sort, setSort] = useState({ _sort: "createdAt", _order: "desc" });
  const [status, setStatus] = useState({ orderStatus: "", paymentStatus: "" });
  const [createOrder, setCreateOrder] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState(1);
  const [filter, setFilter] = useState("");
  const btnArr = [
    {
      name: "Orders List",
      id: 1,

      handleClick: () => {
        setCreateOrder(false);
        setShowBanks(false);
        setSelectedBtn(1);
      },
    },
    {
      name: "Create New Order",
      id: 2,
      disabled: userInfo?.role === "admin",
      handleClick: () => {
        setOrderList(false);
        setCreateOrder(true);
        setShowBanks(false);
        setSelectedBtn(2);
      },
    },
    {
      name: "Bank Details",
      id: 3,
      handleClick: () => {
        setOrderList(false);
        setCreateOrder(true);
        setSelectedBtn(3);
        setShowBanks(true);
        setCreateOrder(false);
      },
    },
  ];

  const onShowSizeChange = (current, size) => {
    setPageSize(size);
  };
  const handleEdit = (order) => {
    setEditableOrderId(order?.id);
    setSelectedOrder(order);
  };
  const handleShow = (order) => {
    // setSelectedOrder(order);
    // setIsModalOpen(true);
    navigate("/orders/adminOrderDetail", { state: { order } });
  };
  const handleCloseModal = () => {
    setIsModalOpen({
      updatePaymentStatus: false,
      updateOrderStatus: false,
    });
    setSelectedOrder(null);
  };

  const handleOrderStatus = (e, order) => {
    const updatedOrder = { ...selectedOrder, status: status.orderStatus };
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  };

  const handleOrderPaymentStatus = (e, order) => {
    const updatedOrder = {
      ...selectedOrder,
      paymentStatus: status.paymentStatus,
    };
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    setSort(sort);
  };

  const handleFindOrder = () => {
    if (filter.username || filter.orderId) {
      const pagination = { _page: page, _limit: pageSize };
      dispatch(
        fetchAllOrdersAsync({
          sort,
          pagination,
          filter,
        })
      );
    } else {
      toast.error("Please enter username or orderId...");
    }
  };

  const chooseColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-purple-200 text-purple-600";
      case "dispatched":
        return "bg-yellow-200 text-yellow-600";
      case "delivered":
        return "bg-green-200 text-green-600";
      case "received":
        return "bg-green-200 text-green-600";
      case "cancelled":
        return "bg-red-200 text-red-600";
      default:
        return "bg-purple-200 text-purple-600";
    }
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: pageSize };
    dispatch(
      fetchAllOrdersAsync({
        sort,
        pagination,
        filter,
      })
    );
  }, [dispatch, page, sort, pageSize]);

  useEffect(() => {
    if (filter) {
      handleFilter();
    }
  }, [filter]);

  const handleFilter = useCallback(
    debounce((query, type) => {
      const pagination = { _page: page, _limit: pageSize };
      // const filter = { [type]: query };
      dispatch(
        fetchAllOrdersAsync({
          sort,
          pagination,
          filter,
        })
      );
    }, 300),
    [filter.username, filter.orderId]
  );

  return (
    <div className="">
      <div className="bg-gray-100 flex items-center justify-center font-sans overflow-auto">
        <div className="w-full">
          <div className="bg-white shadow-md rounded my-6 p-4">
            <div className="flex gap-4">
              {btnArr.map((btn, idx) => {
                return (
                  <CommonButton
                    text={btn.name}
                    buttonClick={() => btn.handleClick()}
                    disabled={btn.disabled}
                    className={`py-2 px-4 rounded-full border-2 border-violet-600 transition-colors duration-300 ${
                      btn.id === selectedBtn
                        ? "bg-green-800 text-white border-green-800"
                        : "bg-green-300 text-gray-800 border-green-300"
                    } hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                );
              })}
            </div>

            {createOrder && userInfo?.role !== "admin" ? (
              <CreateNewOrder />
            ) : showBanks ? (
              <AdminBankDetailsPage></AdminBankDetailsPage>
            ) : (
              <div>
                <div className="flex gap-4 my-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter user name..."
                      onChange={(e) => {
                        // handleFilter(e.target.value, "username");
                        setFilter({ ...filter, username: e.target.value });
                      }}
                      className="rounded-full"
                    />
                    <CommonButton text={"Find"} buttonClick={handleFindOrder} />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter user orderId..."
                      onChange={(e) => {
                        // handleFilter(e.target.value, "orderId");

                        setFilter({ ...filter, orderId: e.target.value });
                      }}
                      className="rounded-full"
                    />
                    <CommonButton text={"Find"} buttonClick={handleFindOrder} />
                  </div>
                </div>
                <table className="w-full table-auto p-4">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th
                        className="py-3 px-0 text-left cursor-pointer"
                        onClick={(e) =>
                          handleSort({
                            sort: "orderId",
                            order: sort?._order === "asc" ? "desc" : "asc",
                          })
                        }
                      >
                        Order#{" "}
                        {sort._sort === "orderId" &&
                          (sort._order === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                          ) : (
                            <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                          ))}
                      </th>
                      {/* <th className="py-3 px-0 text-left">Items</th> */}
                      {userInfo?.role === "admin" ? (
                        <th
                          className="py-3 px-0 text-left cursor-pointer"
                          onClick={(e) =>
                            handleSort({
                              sort: "user.id",
                              order: sort?._order === "asc" ? "desc" : "asc",
                            })
                          }
                        >
                          Customer ID
                          {sort._sort === "user.id" &&
                            (sort._order === "asc" ? (
                              <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                            ) : (
                              <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                            ))}
                        </th>
                      ) : (
                        <th
                          className="py-3 px-0 text-left cursor-pointer"
                          onClick={(e) =>
                            handleSort({
                              sort: "user.name",
                              order: sort?._order === "asc" ? "desc" : "asc",
                            })
                          }
                        >
                          Customer Name
                          {sort._sort === "user.name" &&
                            (sort._order === "asc" ? (
                              <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                            ) : (
                              <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                            ))}
                        </th>
                      )}

                      <th
                        className="py-3 px-0 text-left cursor-pointer"
                        onClick={(e) =>
                          handleSort({
                            sort: "totalAmount",
                            order: sort?._order === "asc" ? "desc" : "asc",
                          })
                        }
                      >
                        Total Amount{" "}
                        {sort._sort === "totalAmount" &&
                          (sort._order === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                          ) : (
                            <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                          ))}
                      </th>
                      <th className="py-3 px-0 text-center">
                        Shipping Address
                      </th>
                      <th className="py-3 px-0 text-center">Order Status</th>
                      <th className="py-3 px-0 text-center">Payment Method</th>
                      <th className="py-3 px-0 text-center">Payment Status</th>
                      <th
                        className="py-3 px-0 text-center cursor-pointer"
                        onClick={(e) =>
                          handleSort({
                            sort: "createdAt",
                            order: sort?._order === "asc" ? "desc" : "asc",
                          })
                        }
                      >
                        Order Time{" "}
                        {sort._sort === "createdAt" &&
                          (sort._order === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                          ) : (
                            <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                          ))}
                      </th>
                      <th
                        className="py-3 px-0 text-center cursor-pointer"
                        onClick={(e) =>
                          handleSort({
                            sort: "updatedAt",
                            order: sort?._order === "asc" ? "desc" : "asc",
                          })
                        }
                      >
                        Last Updated{" "}
                        {sort._sort === "updatedAt" &&
                          (sort._order === "asc" ? (
                            <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                          ) : (
                            <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                          ))}
                      </th>
                      <th className="py-3 px-0 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {orders.length > 0 &&
                      orders?.map((order) => (
                        <tr
                          key={order?.id}
                          className="border-b border-gray-200 hover:bg-gray-100"
                        >
                          <td className="py-3 px-0 text-left whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="mr-2"></div>
                              <span className="font-medium">
                                {order?.orderId}
                              </span>
                            </div>
                          </td>
                          {/* <td className="py-3 px-0 text-left">
                        {order?.items?.map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="mr-2">
                              <img
                                className="w-6 h-6 rounded-full"
                                src={item?.product?.thumbnail}
                                alt={item?.product?.title}
                              />
                            </div>
                            <span>
                              {item?.product?.title} - #{item?.quantity} - $
                              {item?.product?.discountPrice.ordered}
                            </span>
                          </div>
                        ))}
                      </td> */}

                          {userInfo?.role === "admin" ? (
                            <td className="py-3 px-0 text-left">
                              {order?.user?._id}
                            </td>
                          ) : (
                            <td className="py-3 px-0 text-left">
                              {order?.user?.name}
                            </td>
                          )}
                          <td className="py-3 px-0 text-center">
                            <div className="flex items-center justify-center">
                              ₹{order?.totalAmount}
                            </div>
                          </td>
                          <td className="py-3 px-0 text-center">
                            <div className="">
                              <div>
                                <strong>{order?.selectedAddress.name}</strong>,
                              </div>
                              <div>{order?.selectedAddress.street},</div>
                              <div>{order?.selectedAddress.city}, </div>
                              <div>{order?.selectedAddress.state}, </div>
                              <div>{order?.selectedAddress.pinCode}, </div>
                              <div>{order?.selectedAddress.phone}, </div>
                            </div>
                          </td>
                          <td className="py-3 px-0 text-center">
                            {order?.id === editableOrderId ? (
                              <select
                                onChange={(e) => {
                                  setStatus({
                                    ...status,
                                    orderStatus: e.target.value,
                                  });
                                  // setSelectedOrder(order);
                                  setIsModalOpen({
                                    ...isModalOpen,
                                    updateOrderStatus: true,
                                    updatePaymentStatus: false,
                                  });
                                }}
                              >
                                <option value="">Select</option>
                                <option value="pending">Pending</option>
                                <option value="dispatched">Dispatched</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            ) : (
                              <span
                                className={`${chooseColor(
                                  order?.status
                                )} py-1 px-3 rounded-full text-xs`}
                              >
                                {order?.status}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-0 text-center">
                            <div className="flex items-center justify-center">
                              {order?.paymentMethod}
                            </div>
                          </td>

                          <td className="py-3 px-0 text-center">
                            {order?.id === editableOrderId ? (
                              <select
                                onChange={(e) => {
                                  setStatus({
                                    ...status,
                                    paymentStatus: e.target.value,
                                  });
                                  // setSelectedOrder(order);
                                  setIsModalOpen({
                                    ...isModalOpen,
                                    updatePaymentStatus: true,
                                    updateOrderStatus: false,
                                  });
                                }}
                              >
                                <option value="">Select</option>
                                <option value="pending">Pending</option>
                                <option value="received">Received</option>
                              </select>
                            ) : (
                              <span
                                className={`${chooseColor(
                                  order?.paymentStatus
                                )} py-1 px-3 rounded-full text-xs`}
                              >
                                {order?.paymentStatus}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-0 text-center">
                            <div className="flex items-center justify-center">
                              {order?.createdAt
                                ? new Date(order?.createdAt).toLocaleString()
                                : null}
                            </div>
                          </td>

                          <td className="py-3 px-0 text-center">
                            <div className="flex items-center justify-center">
                              {order?.updatedAt
                                ? new Date(order?.updatedAt).toLocaleString()
                                : null}
                            </div>
                          </td>

                          <td className="py-3 px-0 text-center">
                            <div className="flex item-center justify-center">
                              <div className="w-6 mr-4 transform hover:text-purple-500 hover:scale-120">
                                <EyeIcon
                                  className="w-8 h-8"
                                  onClick={(e) => handleShow(order)}
                                ></EyeIcon>
                              </div>
                              <div className="w-6 mr-2 transform hover:text-purple-500 hover:scale-120">
                                {editableOrderId !== order.id ? (
                                  <PencilIcon
                                    className="w-8 h-8"
                                    onClick={(e) => handleEdit(order)}
                                  ></PencilIcon>
                                ) : (
                                  <span
                                    className="cursor-pointer text-2xl font-bold"
                                    onClick={() => setEditableOrderId(-1)}
                                  >
                                    X
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen.updateOrderStatus && (
        <Modal
          title="Confirm "
          message="Are you sure you want to update order status?"
          dangerOption="confirm"
          cancelOption="Cancel"
          dangerAction={handleOrderStatus}
          cancelAction={handleCloseModal}
          showModal={isModalOpen.updateOrderStatus}
        />
      )}{" "}
      {isModalOpen.updatePaymentStatus && (
        <Modal
          title="Confirm "
          message="Are you sure you want to update payment status?"
          dangerOption="confirm"
          cancelOption="Cancel"
          dangerAction={handleOrderPaymentStatus}
          cancelAction={handleCloseModal}
          showModal={isModalOpen.updatePaymentStatus}
        />
      )}
      <Pagination
        showSizeChanger={true}
        onShowSizeChange={onShowSizeChange}
        defaultCurrent={page}
        total={totalOrders}
        pageSize={pageSize}
        onChange={(page) => setPage(page)}
      />
    </div>
  );
}

export default AdminOrders;
