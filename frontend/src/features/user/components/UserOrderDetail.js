import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import InvoiceDownloadBtn from "./InvoiceDownload";
import Loader from "../../common/Loader";
import OrderStages from "./OrderStages";
import CommonButton from "../../common/CommonButton";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderByIdAsync,
  selectOrder,
  selectStatus,
  updateOrderAsync,
} from "../../order/orderSlice";
import ReviewForm from "../../product/components/Reviews";
import { selectUserInfo } from "../userSlice";
import { Modal } from "antd";

const UserOrderDetails = () => {
  const userInfo = useSelector(selectUserInfo);

  const location = useLocation();
  const dispatch = useDispatch();
  const orderLoading = useSelector(selectStatus);
  const orderId = location?.state?.order?.id;
  const order = useSelector(selectOrder);
  const [isShowReviewForm, setIsShowReviewForm] = useState(false);
  const [open, setOpen] = useState(false);
  function getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return {
      date: `${year}-${month}-${day}`, // e.g., "2024-08-23"
      time: `${hours}:${minutes}:${seconds}`, // e.g., "14:35:22"
    };
  }

  const cancelOrder = () => {
    const updatedOrder = {
      id: order?.id,
      orderStages: [
        ...order?.orderStages,
        {
          stage: "cancelled",
          ...getCurrentDateTime(),
          note: "Cancelled by user",
        },
      ],
      currentStage: "Cancelled",
      status: "cancelled",
    };
    dispatch(updateOrderAsync(updatedOrder));
    dispatch(fetchOrderByIdAsync({ orderId }));
  };

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderByIdAsync({ orderId }));
    }
  }, [orderId, dispatch]);

  if (orderLoading === "loading") {
    return <Loader />;
  }

  return (
    <div className="mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between flex-wrap bg-gray-100 rounded-lg shadow-lg">
        <div className="w-full md:w-4/12 p-4">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">
                {order?.selectedAddress?.name}
              </span>
              {/* {order.status !== "pending" && order.status !== "placed" && (
                <button className="text-blue-500 hover:underline">
                  Change
                </button>
              )} */}
            </div>
            <p className="mb-2">{order?.selectedAddress?.email}</p>
            <p className="mb-4">{order?.selectedAddress?.street}</p>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">Phone number</span>
                <p>{order?.selectedAddress?.phone}</p>
              </div>
              {/* {order.status !== "pending" && order.status !== "placed" && (
                <button className="text-blue-500 hover:underline">
                  Change
                </button>
              )} */}
            </div>
          </div>
        </div>

        <div className="w-full  flex justify-end md:w-3/12 p-4">
          <div>
            {order.status !== "pending" ||
              (order.status !== "placed" && (
                <InvoiceDownloadBtn
                  order={order}
                  type="invoice-download"
                  text="Download Invoice"
                />
              ))}
          </div>
        </div>
        {/* <div className="w-full md:w-4/12 p-4">
          {order.status === "cancelled" ||
          order.status === "delivered" ||
          order.status === "return" ||
          order.status === "pending" ? (
            ""
          ) : (
            <CommonButton
              buttonClick={cancelOrder}
              type="button"
              text="Cancel Order"
            />
          )}
        </div> */}
      </div>

      <div>
        <div className="w-full flex flex-col gap-4 items-center">
          <OrderStages currentStage={order?.currentStage} order={order} />
        </div>
      </div>

      {order?.items?.length > 0 &&
        order?.items?.map((item, index) => (
          <div
            key={index}
            className="w-full flex justify-between shadow-sm my-4 p-4"
          >
            <div className="flex items-center mb-4 md:mb-0 w-1/2">
              <a
                href={item.product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-1/3 p-2"
              >
                <img
                  className="h-full w-full object-cover rounded"
                  src={item.product.thumbnail}
                  alt="Product"
                />
              </a>
              <div className="ml-4">
                <a
                  className="text-blue-600 hover:underline text-lg"
                  href={item.product.url}
                  target="_blank"
                >
                  {item.product.title}, {item.product.category}
                </a>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Color: </span>
                  {item.product.color}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Size: </span>
                  {item.product.size}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Qty: </span>
                  {item.quantity}
                </p>
                <p className="text-lg font-semibold mt-2">
                  ₹{item.product.gstIncludedPrice.ordered}
                </p>
                <p className="text-sm text-green-600">1 Offer Applied</p>
              </div>
            </div>

            <div className="w-1/4 flex flex-col mt-4 md:mt-0">
              {/* <Link
                onClick={() => setIsShowReviewForm(true)}
                className="flex items-center text-sm text-blue-600 hover:underline mb-2"
              >
                Rate & Review Product
              </Link>
              {isShowReviewForm && (
                <ReviewForm
                  productId={item?.product?.id}
                  userId={userInfo.id}
                  closeReviewForm={setIsShowReviewForm}
                />
              )} */}

              <>
                <Link
                  onClick={() => setOpen(true)}
                  className="text-sm text-right text-blue-600 hover:underline mb-2 cursor-pointer"
                >
                  Rate & Review Product
                </Link>

                <Modal
                  title="Rate & Review Product"
                  centered
                  open={open}
                  onOk={() => setOpen(false)}
                  onCancel={() => setOpen(false)}
                  width={1000}
                  footer={false}
                >
                  <ReviewForm
                    productId={item?.product?.id}
                    userId={userInfo?.id}
                    closeReviewForm={setOpen}
                  />
                </Modal>
              </>
            </div>

            <div className="w-1/4 text-right">
              {order.status === "pending" && (
                <span className="text-sm text-right text-orange-600 mb-2">
                  Order Note Placed
                </span>
              )}
            </div>
          </div>
        ))}

      <div className="my-4 bg-gray-100 rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-bold mb-2">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Total Items</span>
          <span className="font-semibold">{order?.items?.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Amount</span>
          <span className="font-semibold">₹{order?.totalAmount}</span>
        </div>
      </div>

      <div className=" flex justify-end w-full p-4">
        {order.status === "cancelled" ||
        order.status === "delivered" ||
        order.status === "return" ||
        order.status === "pending" ? (
          ""
        ) : (
          <CommonButton
            buttonClick={cancelOrder}
            type="button"
            text="Cancel Order"
          />
        )}
      </div>
    </div>
  );
};

export default UserOrderDetails;
