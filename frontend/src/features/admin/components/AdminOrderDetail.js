import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersAsync,
  fetchOrderByIdAsync,
  selectOrder,
  selectOrders,
  selectStatus,
  selectTotalOrders,
  updateOrderAsync,
} from "../../order/orderSlice";
import {
  PencilIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { IoClose } from "react-icons/io5";
import { Button, Modal } from "antd";

import AdminOrderDetailModal from "./AdminOrderDetailModal";
import { useLocation, useNavigate } from "react-router-dom";
import CommonButton from "../../common/CommonButton";
import InvoiceDownloadBtn from "../../user/components/InvoiceDownload";
import toast from "react-hot-toast";
import { fetchOrderById } from "../../order/orderAPI";
import Loader from "../../common/Loader";

import CurrentStageForm from "./CurrentStageForm";
import AdminOrderStages from "./AdminOrderStages";

function AdminOrderDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location?.state?.order?.id;
  const order = useSelector(selectOrder);

  const orderLoading = useSelector(selectStatus);
  const dispatch = useDispatch();
  const [editableOrderId, setEditableOrderId] = useState(null);
  const [sort, setSort] = useState({});
  const [expectedDelivery, setExpectedDelivery] = useState(
    order?.expectedDelivery
  );
  const [trackingId, setTrackingId] = useState(order?.trackingId);

  const [logistics, setLogistics] = useState(order?.logistics);

  const [orderedPrice, setOrderedPrice] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderStages, setOrderStages] = useState("");
  const [editStatus, setEditStatus] = useState(null);
  const [editStage, setEditStage] = useState(null);

  const [handleEditLogisticsAndId, setHandleEditLogisticsAndId] = useState({
    logistics: "",
    trackingId: "",
    edit: false,
  });

  const [handleEditExpectedDelivery, setHandleEditExpectedDelivery] = useState({
    expectedDelivery: "",
    edit: false,
  });

  const handleEdit = (item) => {
    setEditableOrderId(item?.product?.id);
  };

  const handleOrderPriceChange = (e) => {
    setOrderedPrice(e.target.value);
  };

  const handleItemQuantity = (e) => {
    setItemQuantity();
    setEditableOrderId(-1);
  };

  const handleOrderStatus = (order) => {
    if (orderStatus) {
      const updatedOrder = { ...order, status: orderStatus };
      dispatch(updateOrderAsync(updatedOrder));
      setEditableOrderId(-1);
      setEditStatus(false);
      dispatch(fetchOrderByIdAsync({ orderId }));
    } else {
      toast.error("Please select order status.");
    }
  };

  const handleOrderStage = (orderStages) => {
    if (orderStages) {
      setEditableOrderId(-1);
      setEditStage(false);
      dispatch(fetchOrderByIdAsync({ orderId }));
    } else {
      toast.error("Please select order status.");
    }
  };

  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    setSort(sort);
  };

  const handleTrackingIdChange = (e) => {
    setTrackingId(e.target.value);
  };
  const handleLogisticsChange = (e) => {
    setLogistics(e.target.value);
  };

  const handleExpectedDeliveryChange = (e) => {
    setExpectedDelivery(e.target.value);
  };

  const handleDispatch = (dispatchData, _) => {
    if (!trackingId && logistics && expectedDelivery) {
      toast.error(
        "Please enter tracking Id, logistic and Expected Delivery Date "
      );
      return;
    }
    const updatedOrder = {
      ...order,
      status: "dispatched",
      trackingId,
      logistics,
      expectedDelivery,
      ...dispatchData,
    };
    dispatch(updateOrderAsync(updatedOrder));
    dispatch(fetchOrderByIdAsync({ orderId }));
  };

  const handleSaveLogisticsAnId = () => {
    if (trackingId && logistics & expectedDelivery) {
      const updatedOrder = {
        ...order,
        trackingId,
        logistics,
        expectedDelivery,
      };
      dispatch(updateOrderAsync(updatedOrder));
      setHandleEditLogisticsAndId({ ...handleEditLogisticsAndId, edit: false });
      dispatch(fetchOrderByIdAsync({ orderId }));
    } else {
      toast.error("Tracking ID, Logistics and Expected Delivery Date require.");
    }
  };
  // const handleSaveLogisticsAnId = () => {
  //   if (logistics) {
  //     const updatedOrder = { ...order, logistics };
  //     dispatch(updateOrderAsync(updatedOrder));
  //     setHandleEditLogisticsAndId({ ...editLogistics, edit: false });
  //   }
  // };

  const handleItemSubmit = (idx) => {
    const updatedOrder = order;
    if (orderedPrice) {
      updatedOrder.items[idx].product.discountPrice.ordered = orderedPrice;
    }
    if (itemQuantity) {
      updatedOrder.items[idx].quantity = parseInt(itemQuantity, 10);

      const totalItems = updatedOrder.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      updatedOrder.totalItems = totalItems;
    }
    dispatch(updateOrderAsync(updatedOrder));
    dispatch(fetchOrderByIdAsync({ orderId }));
  };

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderByIdAsync({ orderId }));
    }
  }, [orderId, dispatch]);

  useEffect(() => {
    if (order.status) {
      setTrackingId(order?.trackingId);
      setLogistics(order?.logistics);
      setExpectedDelivery(order?.expectedDelivery);
    }
  }, [order]);

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

  if (orderLoading === "loading") {
    return <Loader />;
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center font-sans overflow-auto p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white shadow-md rounded my-6 p-4">
          <h1 className="flex text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Order # {order?.orderId}
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-red-600">
              Order Status:{" "}
            </h3>

            <div className="flex items-center gap-3">
              {editStatus ? (
                <select onChange={(e) => setOrderStatus(e.target.value)}>
                  <option value="">select</option>
                  <option value="pending">Pending</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="cancelled">return</option>
                  <option value="cancelled">refund</option>
                </select>
              ) : (
                <span
                  className={`py-1 px-3 rounded-full text-xs ${chooseColor(
                    order?.status
                  )}`}
                >
                  {order?.status}
                </span>
              )}
              {editStatus ? (
                <CheckIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => handleOrderStatus(order)}
                />
              ) : (
                <PencilIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setEditStatus(true)}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end items-center mb-4 space-x-3">
            <InvoiceDownloadBtn
              order={order}
              type={"packing-slip-download"}
              text="Download Packing Slip"
            />

            <InvoiceDownloadBtn
              order={order}
              type={"invoice-download"}
              text="Download Invoice"
            />
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left cursor-pointer">
                  Product Name
                </th>
                <th className="py-3 px-6 text-left cursor-pointer">
                  Product Code
                </th>
                <th className="py-3 px-6 text-center cursor-pointer">
                  Quantity
                </th>
                <th
                  className="py-3 px-6 text-center cursor-pointer"
                  onClick={() =>
                    handleSort({
                      sort: "updatedAt",
                      order: sort?._order === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  Price
                  {sort._sort === "updatedAt" &&
                    (sort._order === "asc" ? (
                      <ArrowUpIcon className="w-4 h-4 inline" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 inline" />
                    ))}
                </th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {order?.items?.length > 0 &&
                order?.items?.map((item, idx) => (
                  <tr
                    key={order?.id + idx}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-medium">
                          {item.product.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">{item?.product.sku}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center">
                        {item?.product?.id === editableOrderId ? (
                          <input
                            type="number"
                            className="w-12 border rounded p-1"
                            onChange={handleItemQuantity}
                          />
                        ) : (
                          <span className="py-1 px-3 rounded-full text-xs">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {item?.product.id === editableOrderId ? (
                        <input
                          type="number"
                          className="w-12 border rounded p-1"
                          onClick={(e) => handleOrderPriceChange(e)}
                        />
                      ) : (
                        <span className="py-1 px-3 rounded-full text-xs">
                          ₹{item?.product.discountPrice.ordered}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center">
                        {editableOrderId === item.product.id ? (
                          <div className="flex justify-between mr-2 transform">
                            <IoClose
                              className="font-bold text-2xl cursor-pointer  hover:text-purple-500 hover:scale-110"
                              onClick={() => setEditableOrderId(null)}
                            />
                            <CheckIcon
                              className="w-6 h-6 text-4xl hover:text-purple-500 hover:scale-110"
                              onClick={() => handleItemSubmit(idx)}
                            />
                          </div>
                        ) : (
                          <div className="w-6 mr-2 transform hover:text-purple-500 hover:scale-110">
                            <PencilIcon
                              className="w-6 h-6"
                              onClick={() => handleEdit(item)}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Payment Method</p>
              <p>{order?.paymentMethod}</p>
            </div>
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>₹{order?.totalAmount}</p>
            </div>
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Total Items</p>
              <p>{order?.totalItems} items</p>
            </div>
            <p className="mt-1 text-sm text-gray-500">Shipping Address:</p>
            <div className="flex flex-col border border-gray-200 p-4 bg-white">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {order?.selectedAddress?.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {order?.selectedAddress?.street}
                </p>
                <p className="text-sm text-gray-500">
                  {order?.selectedAddress?.city}
                </p>
                <p className="text-xs text-gray-500">
                  {order?.selectedAddress?.pinCode}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="text-sm text-gray-900">
                  Phone: {order?.selectedAddress?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex gap-4 justify-between">
            <div className="flex items-center gap-4 mb-4">
              <label
                htmlFor="logistics"
                className="text-sm font-medium text-gray-700"
              >
                Logistics
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                {order?.logistics && !handleEditLogisticsAndId.edit ? (
                  <input
                    type="text"
                    name="logistics"
                    id="logistics"
                    placeholder="Enter Logistics Name..."
                    disabled={order?.logistics}
                    value={logistics}
                    // onChange={handleTrackingIdChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                ) : (
                  <input
                    type="text"
                    name="logistics"
                    id="logistics"
                    placeholder="Enter Logistics Name..."
                    value={logistics}
                    onChange={handleLogisticsChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                )}
              </div>

              <div className="flex items-center gap-4">
                <label
                  htmlFor="trackingId"
                  className="text-sm font-medium text-gray-700"
                >
                  Tracking ID
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  {order?.trackingId && !handleEditLogisticsAndId.edit ? (
                    <input
                      type="text"
                      name="trackingId"
                      id="trackingId"
                      placeholder="Enter Tracking ID"
                      disabled={order?.trackingId}
                      value={trackingId}
                      // onChange={handleTrackingIdChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    <input
                      type="text"
                      name="trackingId"
                      id="trackingId"
                      placeholder="Enter Tracking ID"
                      value={trackingId}
                      onChange={handleTrackingIdChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  )}
                </div>
                {/* {order?.trackingId &&
                handleEditLogisticsAndId.edit === false ? (
                  <PencilIcon
                    className="w-4 h-4 cursor-pointer"
                    onClick={() =>
                      setHandleEditLogisticsAndId({
                        ...handleEditLogisticsAndId,
                        edit: true,
                      })
                    }
                  />
                ) : (
                  ""
                )} */}

                {/* {handleEditLogisticsAndId.edit ? (
                  <CommonButton
                    buttonClick={handleSaveLogisticsAnId}
                    text="Save"
                    type="button"
                    className="rounded-full"
                  ></CommonButton>
                ) : (
                  ""
                )} */}
              </div>

              <div className="flex items-center gap-4">
                <label
                  htmlFor="expectedDelivery"
                  className="text-sm font-medium text-gray-700"
                >
                  Expected Delivery
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  {order?.expectedDelivery &&
                  !handleEditExpectedDelivery.edit ? (
                    <input
                      type="date"
                      name="expectedDelivery"
                      id="expectedDelivery"
                      placeholder="Enter Expected Delivery Date..."
                      disabled={order?.expectedDelivery}
                      value={expectedDelivery}
                      // onChange={handleTrackingIdChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    <input
                      type="date"
                      name="expectedDelivery"
                      id="expectedDelivery"
                      placeholder="Enter Expected Delivery Date..."
                      value={expectedDelivery}
                      onChange={handleExpectedDeliveryChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  )}
                </div>

                {order?.trackingId &&
                handleEditLogisticsAndId.edit === false ? (
                  <PencilIcon
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => {
                      setHandleEditLogisticsAndId({
                        ...handleEditLogisticsAndId,
                        edit: true,
                      });
                      setHandleEditExpectedDelivery({
                        ...handleEditExpectedDelivery,
                        edit: true,
                      });
                    }}
                  />
                ) : (
                  ""
                )}

                {/* {order?.expectedDelivery &&
                handleEditLogisticsAndId.edit === false ? (
                  <PencilIcon
                    className="w-4 h-4 cursor-pointer"
                    onClick={() =>
                      setHandleEditExpectedDelivery({
                        ...handleEditExpectedDelivery,
                        edit: true,
                      })
                    }
                  />
                ) : (
                  ""
                )} */}

                {handleEditLogisticsAndId.edit ? (
                  <>
                    <CommonButton
                      buttonClick={handleSaveLogisticsAnId}
                      text="Save"
                      type="button"
                      className="rounded-full"
                    ></CommonButton>

                    <CommonButton
                      buttonClick={() => {
                        setHandleEditLogisticsAndId({
                          logistics: "",
                          trackingId: "",
                          edit: false,
                        });
                        setHandleEditExpectedDelivery({
                          expectedDelivery: "",
                          edit: false,
                        });
                      }}
                      text="Cancel"
                      type="button"
                      className="rounded-full"
                    ></CommonButton>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
            {order?.status === "pending" ? (
              <CurrentStageForm
                callFunction={handleDispatch}
                btnText={"Dispatch"}
                order={order}
              />
            ) : (
              ""
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-red-600">
              Order Stage:{" "}
            </h3>

            <div className="flex items-center gap-3">
              {order?.currentStage ? (
                <span
                  className={`py-1 px-3 rounded-full text-xs ${chooseColor(
                    order?.currentStage
                  )}`}
                >
                  {order?.currentStage}
                </span>
              ) : (
                <span
                  className={`py-1 px-3 rounded-full text-xs ${chooseColor(
                    order?.currentStage
                  )}`}
                >
                  {order?.status}
                </span>
              )}

              <CurrentStageForm
                order={order}
                handleOrderStage={handleOrderStage}
                setOrderStages={setOrderStages}
                closeForm={setEditStage}
                btnText={
                  <PencilIcon
                    className="w-4 h-2 cursor-pointer"
                    // onClick={() => setEditStage(true)}
                  />
                }
              />
            </div>
          </div>
          <div className="w-full flex gap-4 items-center">
            {<AdminOrderStages order={order} setOrderStages={setOrderStages} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;
