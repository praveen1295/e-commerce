import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import apiClient from "../../common/apiClient";
import toast from "react-hot-toast";
import { handleApiError } from "../../../utils";
import CommonSearchBar from "../../common/CommonSearchBar";
import {
  resetUserSearchResults,
  searchUserAsync,
  selectSearchUsersResults,
} from "../../user/userSlice";
import {
  resetSearchResults,
  searchProductAsync,
  selectSearchResults,
} from "../../product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import CommonButton from "../../common/CommonButton";
import { createOrderAsync } from "../../order/orderSlice";
import { useAlert } from "react-alert";
import { selectLoggedInUser } from "../../auth/authSlice";

const Label = ({ htmlFor, children, required }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium leading-6 text-gray-900"
  >
    {children}
    {required && <span className="text-red-500"> *</span>}
  </label>
);

export default function CreateNewOrder() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const alert = useAlert();
  const user = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();
  const selectedProduct = useSelector(selectSearchResults);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [products, setProducts] = useState([]);
  const [otherData, setOtherData] = useState({
    totalAmount: 0,
    paymentMethod: "card",
    orderStatus: "pending",
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddDeliveryAddress, setIsAddDeliveryAddress] = useState(false);
  const [orderData, setOrderData] = useState({});

  const handleAddProductField = (product) => {
    setProducts([...products, {}]);
  };

  const handleAddProduct = (index) => {
    const item = {};
    item.user = selectedCustomer.id;
    item.product = selectedProduct;
    const updatedProducts = [...products];
    updatedProducts[index] = item;
    setProducts(updatedProducts);
  };

  const handleChangeQuantity = (index, e) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      products[index].quantity = value;
    }
  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleChangeProduct = (index, e) => {
    dispatch(searchProductAsync({ query: e.target.value, userId: user?.id }));
  };

  const handleQuantityChange = (index, e) => {
    const productsArr = products.map((item, idx) => {
      if (index === idx) {
        return { ...item, quantity: Number(e.target.value) };
      }
      return item;
    });

    setProducts(productsArr);
  };

  const onOrderSubmit = async (data) => {
    if (selectedCustomer.status === "inactive") {
      toast.error(
        `Customer's account status is ${selectedCustomer.status} please try after some time or contact customer care`
      );

      alert.error(
        `Customer's account status is ${selectedCustomer.status} please try after some time or contact customer care`
      );
      return;
    }

    const items = products.map((item, idx) => {
      return { ...item, user: selectedCustomer.id };
    });

    let order = { ...orderData, ...otherData };

    order.items = items;

    if (
      (selectedAddress || selectedCustomer.addresses[0]) &&
      otherData.paymentMethod
    ) {
      dispatch(createOrderAsync(order));

      setProducts([]);
      setSelectedCustomer({});
    } else {
      alert.info("Enter Address and Payment method");
    }
  };

  const handleUserClick = (data) => {
    setSelectedCustomer(data);
    dispatch(resetUserSearchResults());
  };

  const handleProductClick = (data) => {
    setProducts([...products, { product: data, quantity: 1 }]);
    dispatch(resetSearchResults());
  };

  useEffect(() => {
    const address =
      selectedCustomer?.addresses?.length > 0
        ? selectedCustomer?.addresses[0]
        : null;
    setValue("phoneNumber", selectedCustomer?.phone_number);
    setValue("userId", selectedCustomer?.id);

    setValue(
      "address",
      address
        ? `${address.name},  ${address.street}, ${address.city}, ${address.state} - ${address.pinCode}, ${address.phone}`
        : ""
    );
  }, [selectedCustomer]);

  useEffect(() => {
    const data = {};

    const totalAmount = products?.reduce((acc, curr) => {
      return (acc +=
        curr?.product.gstIncludedPrice[selectedCustomer.user_category] *
        curr?.quantity);
    }, 0);

    setOtherData({ ...otherData, totalAmount: totalAmount });
    data.totalAmount = totalAmount;

    data.totalItems = products.reduce((acc, curr) => {
      return (acc += curr.quantity);
    }, 0);

    data.user = selectedCustomer?.id;

    data.selectedAddress = selectedAddress
      ? selectedAddress
      : selectedCustomer?.addresses[0];

    setOrderData({ ...orderData, ...data });

    // paymentMethod;
    // paymentStatus;
    // status;
    // orderStage;
  }, [products, selectedAddress]);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100">
      <div className="w-full bg-white shadow-md rounded-md p-5">
        <h2 className="text-3xl mb-4">Create New Order</h2>
        <form onSubmit={handleSubmit()} className="flex justify-between gap-4">
          <div className="w-1/3">
            <div className="mb-4">
              <Label htmlFor="userName" required>
                Search/Select Customer
              </Label>
              <CommonSearchBar
                styles={""}
                isSearch={""}
                searchFunction={searchUserAsync}
                searchQuery={userSearchQuery}
                setSearchQuery={setUserSearchQuery}
                selectSearchResults={selectSearchUsersResults}
                htmlFor={"userName"}
                placeholder={"Enter customer name..."}
                searchType="user"
                handleClick={handleUserClick}
              />
            </div>
            {selectedCustomer && (
              <>
                <div className="mb-4">
                  <Label htmlFor="userId" required>
                    User ID
                  </Label>
                  <input
                    id="userId"
                    {...register("userId", { required: "User ID is required" })}
                    type="text"
                    disabled={true}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                  {errors.userId && (
                    <p className="text-red-500">{errors.userId.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Label htmlFor="phoneNumber" required>
                    Phone Number
                  </Label>
                  <input
                    id="phoneNumber"
                    {...register("phoneNumber", {
                      required: "Address name is required",
                    })}
                    disabled={true}
                    type="text"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500">{errors.phoneNumber.message}</p>
                  )}
                </div>

                {/* Address Details */}
                <div className="mb-4">
                  <Label htmlFor="address" required>
                    Address
                  </Label>
                  <input
                    id="address"
                    {...register("address", {
                      required: "Address name is required",
                    })}
                    type="text"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  />
                  {errors.address && (
                    <p className="text-red-500">{errors.address.message}</p>
                  )}
                </div>

                <CommonButton
                  text={"Add Another Delivery Address"}
                  buttonClick={() =>
                    setIsAddDeliveryAddress(!isAddDeliveryAddress)
                  }
                ></CommonButton>

                {isAddDeliveryAddress && (
                  <div>
                    <div className="mb-4">
                      <Label htmlFor="da_name" required>
                        name
                      </Label>
                      <input
                        id="da_name"
                        {...register("da_name", {
                          required: "Address name is required",
                        })}
                        onChange={(e) =>
                          setSelectedAddress({
                            ...selectedAddress,
                            name: e.target.value,
                          })
                        }
                        type="text"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      />
                      {errors.address && (
                        <p className="text-red-500">{errors.da_name.message}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="da_street" required>
                        Street
                      </Label>
                      <input
                        id="da_street"
                        {...register("da_street", {
                          required: "Address name is required",
                        })}
                        onChange={(e) =>
                          setSelectedAddress({
                            ...selectedAddress,
                            street: e.target.value,
                          })
                        }
                        type="text"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      />
                      {errors.da_street && (
                        <p className="text-red-500">
                          {errors.da_street.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="da_phoneNumber" required>
                        Phone Number
                      </Label>
                      <input
                        id="da_phoneNumber"
                        {...register("da_phoneNumber", {
                          required: "Address name is required",
                        })}
                        onChange={(e) =>
                          setSelectedAddress({
                            ...selectedAddress,
                            phone: e.target.value,
                          })
                        }
                        type="text"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      />
                      {errors.da_phoneNumber && (
                        <p className="text-red-500">
                          {errors.da_phoneNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="da_email" required>
                        Email
                      </Label>
                      <input
                        id="da_email"
                        {...register("da_email", {
                          required: "Address name is required",
                        })}
                        onChange={(e) =>
                          setSelectedAddress({
                            ...selectedAddress,
                            email: e.target.value,
                          })
                        }
                        type="text"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      />
                      {errors.da_email && (
                        <p className="text-red-500">
                          {errors.da_email.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="da_city" required>
                        City
                      </Label>
                      <input
                        id="da_city"
                        {...register("da_city", {
                          required: "Address name is required",
                        })}
                        onChange={(e) =>
                          setSelectedAddress({
                            ...selectedAddress,
                            city: e.target.value,
                          })
                        }
                        type="text"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      />
                      {errors.da_city && (
                        <p className="text-red-500">{errors.da_city.message}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="da_state" required>
                        State
                      </Label>
                      <input
                        id="da_state"
                        {...register("da_state", {
                          required: "Address name is required",
                        })}
                        onChange={(e) =>
                          setSelectedAddress({
                            ...selectedAddress,
                            state: e.target.value,
                          })
                        }
                        type="text"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      />
                      {errors.da_state && (
                        <p className="text-red-500">
                          {errors.da_state.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <Label htmlFor="da_pin_code" required>
                        Pin Code
                      </Label>
                      <input
                        id="da_pin_code"
                        {...register("da_pin_code", {
                          required: "Address name is required",
                        })}
                        onChange={(e) =>
                          setSelectedAddress({
                            ...selectedAddress,
                            pinCode: e.target.value,
                          })
                        }
                        type="text"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      />
                      {errors.da_pin_code && (
                        <p className="text-red-500">
                          {errors.da_pin_code.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="w-full">
            {selectedCustomer && (
              <div className="mb-4">
                <Label htmlFor="" required>
                  Search/Select Product
                </Label>

                <CommonSearchBar
                  styles={""}
                  isSearch={""}
                  searchFunction={searchProductAsync}
                  searchQuery={productSearchQuery}
                  setSearchQuery={setProductSearchQuery}
                  selectSearchResults={selectSearchResults}
                  placeholder={"Enter product name..."}
                  searchType="product"
                  // htmlFor={`productTitle_${index}`}
                  handleClick={handleProductClick}
                />
              </div>
            )}

            {products.length > 0 && (
              <div>
                <div className="flex gap-4 mb-4">
                  {products.map((item, index) => {
                    return (
                      <div className="space-y-4">
                        <div className="p-4 border rounded-md bg-gray-50">
                          <input
                            id={`productTitle_${index}`}
                            name="title"
                            value={item.product.title}
                            disabled={true}
                            onChange={(e) => handleChangeProduct(index, e)}
                            type="text"
                            placeholder="Product Title"
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                          />
                          <div className="mb-4">
                            <Label htmlFor={`productPrice_${index}`} required>
                              Price
                            </Label>
                            <input
                              id={`productPrice_${index}`}
                              name="price"
                              value={
                                item.product.gstIncludedPrice[
                                  selectedCustomer?.user_category
                                ]
                              }
                              disabled={true}
                              onChange={(e) => handleChangeProduct(index, e)}
                              type="number"
                              step="0.01"
                              placeholder="Product Price"
                              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                            />
                          </div>

                          <div className="mb-4">
                            <Label htmlFor={`productStock_${index}`} required>
                              Stock
                            </Label>
                            <input
                              id={`productStock_${index}`}
                              name="stock"
                              value={item?.product?.stock}
                              onChange={(e) => handleChangeProduct(index, e)}
                              disabled={true}
                              type="number"
                              placeholder="Stock"
                              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                            />
                          </div>

                          <div className="mb-4">
                            <Label htmlFor={`productStock_${index}`} required>
                              Quantity
                            </Label>
                            <input
                              id={`quantity${index}`}
                              name={`quantity_${index}`}
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(index, e)}
                              type="number"
                              placeholder="Quantity"
                              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove Product
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4">
                  <div className="mb-4">
                    <Label htmlFor="totalAmount" required>
                      Total Amount
                    </Label>
                    <input
                      id="totalAmount"
                      {...register("totalAmount", {
                        required: "Total amount is required",
                      })}
                      onChange={(e) =>
                        setOtherData({
                          ...otherData,
                          totalAmount: e.target.value,
                        })
                      }
                      value={otherData.totalAmount}
                      type="number"
                      step="0.01"
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                    {errors.totalAmount && (
                      <p className="text-red-500">
                        {errors.totalAmount.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="paymentMethod" required>
                      Payment Method
                    </Label>
                    <select
                      id="paymentMethod"
                      {...register("paymentMethod", {
                        required: "Payment method is required",
                      })}
                      onChange={(e) =>
                        setOtherData({
                          ...otherData,
                          paymentMethod: e.target.value,
                        })
                      }
                      value={otherData.paymentMethod}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    >
                      <option value="">Select</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                    </select>
                    {errors.paymentMethod && (
                      <p className="text-red-500">
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="status" required>
                      Order Status
                    </Label>
                    <select
                      id="status"
                      {...register("status", {
                        required: "Order status is required",
                      })}
                      onChange={(e) =>
                        setOtherData({
                          ...otherData,
                          orderStatus: e.target.value,
                        })
                      }
                      value={otherData.orderStatus}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="processed">Processed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500">{errors.status.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {selectedCustomer && products.length > 0 && (
              <div className="flex justify-end mt-4">
                {/* <Link
              to="/orders"
              className="py-2 px-4 mr-2 rounded-md bg-gray-200 text-black hover:bg-gray-300"
            >
              Cancel
            </Link> */}
                <CommonButton
                  text={"Create Order"}
                  type="button"
                  buttonClick={onOrderSubmit}
                  // className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                ></CommonButton>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
