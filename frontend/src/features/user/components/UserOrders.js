import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo, selectUserInfoStatus } from "../userSlice";
import { Grid } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import {
  fetchLoggedInUserOrderAsync,
  selectTotalMyOrders,
  selectUserOrders,
} from "../../order/orderSlice";
import { Pagination } from "antd";
import { ITEMS_PER_PAGE } from "../../../app/constants";

export default function UserOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector(selectUserInfo);
  const totalMyOrders = useSelector(selectTotalMyOrders);
  const myOrders = useSelector(selectUserOrders);

  const status = useSelector(selectUserInfoStatus);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [sort, setSort] = useState({ _sort: "createdAt", _order: "desc" });

  const onShowSizeChange = (current, size) => {
    setPageSize(size);
  };

  const handleOrderClick = (order) => {
    navigate("/my-orders/orderDetail", { state: { order } });
  };
  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    setSort(sort);
  };
  useEffect(() => {
    if (userInfo) {
      const pagination = { _page: page, _limit: pageSize };

      const filter = { id: userInfo.id };

      dispatch(
        fetchLoggedInUserOrderAsync({
          sort,
          pagination,
          filter,
        })
      );
    }
  }, [dispatch, userInfo, page, sort, pageSize]);

  return (
    <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
      {status === "loading" ? (
        <div className="flex justify-center items-center h-96">
          <Grid
            height="80"
            width="80"
            color="rgb(79, 70, 229)"
            ariaLabel="grid-loading"
            radius="12.5"
            visible={true}
          />
        </div>
      ) : (
        <>
          {myOrders.length > 0 ? (
            myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow rounded-lg mb-6 overflow-hidden"
              >
                <div
                  className="border-b border-gray-200 px-4 py-6 sm:px-6 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleOrderClick(order)}
                >
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    Order # {order.orderId}
                  </h1>
                  <h3 className="text-lg sm:text-xl font-semibold text-red-600 mb-4">
                    Order Status: {order.status}
                  </h3>
                  <div className="flow-root">
                    <ul className="divide-y divide-gray-200">
                      {order.items.map((item, index) => (
                        <li key={item.id + index} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.product.thumbnail}
                              alt={item.product.title}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-4 flex flex-1 flex-col">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <a
                                  href={`/product/${item.product.id}`}
                                  className="hover:text-blue-600"
                                >
                                  {item.product.title}
                                </a>
                              </h3>
                              <p className="ml-4">
                                ₹{item.product.gstIncludedPrice?.ordered}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.product.brand}
                            </p>
                            <div className="flex items-end justify-between text-sm mt-4">
                              <div className="text-gray-500">
                                <label className="font-medium">
                                  Qty: {item.quantity}
                                </label>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>₹{order.totalAmount}</p>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total Items in Cart</p>
                    <p>{order.totalItems} items</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Shipping Address:
                  </p>
                  <div className="flex flex-col sm:flex-row sm:justify-between border border-gray-200 p-4 bg-white">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {order.selectedAddress.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {order.selectedAddress.street}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.selectedAddress.pinCode}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <p className="text-sm text-gray-900">
                        Phone: {order.selectedAddress.phone}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.selectedAddress.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">No orders found.</p>
          )}

          <div className="mt-6 flex justify-center">
            <Pagination
              showSizeChanger
              onShowSizeChange={onShowSizeChange}
              current={page}
              total={totalMyOrders}
              pageSize={pageSize}
              onChange={(page) => setPage(page)}
              className="ant-pagination"
            />
          </div>
        </>
      )}
    </div>
  );
}
