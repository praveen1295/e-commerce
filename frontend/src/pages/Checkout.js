import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemFromCartAsync,
  selectItems,
  updateCartAsync,
} from "../features/cart/cartSlice";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateUserAsync } from "../features/user/userSlice";
import { useEffect, useState } from "react";
import {
  createOrderAsync,
  selectCurrentOrder,
  selectStatus,
} from "../features/order/orderSlice";
import { selectUserInfo } from "../features/user/userSlice";
import { Grid } from "react-loader-spinner";
import {
  getDiscountPercentage,
  getDiscountPrice,
  getGstIncludedPrice,
  handleRazorPayPayment,
} from "../utils";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { useAlert } from "react-alert";
import CommonButton from "../features/common/CommonButton";
import Loader from "../features/common/Loader";
import { Modal } from "antd";
import BankDetailsModal from "./BankDetailsModal";

function Checkout() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  // const cartProducts = useSelector(selectItems);
  const alert = useAlert();
  const navigate = useNavigate();
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);

  const user = useSelector(selectUserInfo);
  const items = useSelector(selectItems);
  const status = useSelector(selectStatus);
  const currentOrder = useSelector(selectCurrentOrder);

  const totalAmount = items.reduce((amount, item) => {
    return (
      getGstIncludedPrice(user.user_category, item.product) * item.quantity +
      amount
    );
  }, 0);
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const [outOfStock, setOutOfStockStock] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: "Your Bank",
    accountNumber: "1234567890",
    ifscCode: "IFSC1234",
    accountHolderName: "John Doe",
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const updateDiscountsForUserCategory = (items, userCategory) => {
    return items.map((item) => {
      const { discountPrice, gstIncludedPrice, discountPercentage } =
        item.product;

      if (
        discountPrice[userCategory] &&
        gstIncludedPrice[userCategory] &&
        discountPercentage[userCategory]
      ) {
        return {
          ...item,
          product: {
            ...item.product,
            discountPrice: {
              ...discountPrice,
              ordered: discountPrice[userCategory],
            },
            gstIncludedPrice: {
              ...gstIncludedPrice,
              ordered: gstIncludedPrice[userCategory],
            },
            discountPercentage: {
              ...discountPercentage,
              ordered: discountPercentage[userCategory],
            },
          },
        };
      }

      return item;
    });
  };

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };

  const handleAddress = (e) => {
    setSelectedAddress(user.addresses[e.target.value]);
  };

  const handlePayment = (e) => {
    const value = e.target.value;
    // if (value === "bankTransfer") {
    //   setShowBankDetails(true);
    //   setPaymentMethod(value);
    // }
    setPaymentMethod(e.target.value);
  };

  const handleOrder = async (e) => {
    if (outOfStock) {
      toast("Please remove out of Stock products from cart");
      return;
    }

    if (user.status === "inactive") {
      toast.error(
        `Your account status is ${user.status} please try after some time or contact customer care`
      );

      alert.error(
        `Your account status is ${user.status} please try after some time or contact customer care`
      );

      return;
    }
    if (selectedAddress && paymentMethod) {
      let status = "pending";
      if (paymentMethod === "cash") {
        status = "placed";
      } else if (paymentMethod === "bankTransfer") {
        status = "placed";
        openModal();
        return;
      }
      const order = {
        items: updateDiscountsForUserCategory(items, user.user_category),
        totalAmount,
        totalItems,
        user: user.id,
        paymentMethod,
        selectedAddress,
        status, // other status can be delivered, received.
      };

      // dispatch(createOrderAsync(order));

      dispatch(createOrderAsync(order));
    } else {
      alert.info("Enter Address and Payment method");
    }
  };

  const handleTransfer = () => {
    if (outOfStock) {
      toast("Please remove out of Stock products from cart");
      return;
    }

    if (user.status === "inactive") {
      toast.error(
        `Your account status is ${user.status} please try after some time or contact customer care`
      );

      alert.error(
        `Your account status is ${user.status} please try after some time or contact customer care`
      );

      return;
    }

    if (selectedAddress && paymentMethod) {
      let status = "pending";
      if (paymentMethod === "bankTransfer") {
        status = "placed";
        const order = {
          items: updateDiscountsForUserCategory(items, user.user_category),
          totalAmount,
          totalItems,
          user: user.id,
          paymentMethod,
          referenceNumber,
          selectedAddress,
          status, // other status can be delivered, received.
        };

        // dispatch(createOrderAsync(order));

        dispatch(createOrderAsync(order));

        setIsOpen(false);
      } else {
        alert.info("Enter Address and Payment method");
      }
    }
  };

  const handleSuccessPayment = (success) => {
    // Check if the order was created successfully
    if (success) {
      // Redirect to order success page
      navigate(`/order-success/${currentOrder.id}`);
    } else {
      alert.error("Failed to create order. Please try again.");
    }
  };

  useEffect(() => {
    if (currentOrder && currentOrder.paymentMethod === "card") {
      const order = {
        items: updateDiscountsForUserCategory(items, user.user_category),
        totalAmount,
        totalItems,
        user: user.id,
        paymentMethod,
        selectedAddress,
        status: "pending", // other status can be delivered, received.
      };
      handleRazorPayPayment(currentOrder, toast, user, handleSuccessPayment);
    }
  }, [currentOrder, currentOrder?.paymentMethod]);

  useEffect(() => {
    if (items?.length > 0) {
      const hasOutOfStockItem = items.some((item) => item.stock <= 0);
      setOutOfStockStock(hasOutOfStockItem);
    }
  }, [items]);

  // payment integration
  const makePayment = async () => {
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

    const order = {
      items: updateDiscountsForUserCategory(items, user.user_category),
      totalAmount,
      totalItems,
      user: user.id,
      paymentMethod,
      selectedAddress,
      status: "pending", // other status can be delivered, received.
    };
    // const body = {
    //   products: carts,
    // };
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/create-checkout-session`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(order),
      }
    );

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };

  return (
    <>
      {!items.length && <Navigate to="/home" replace={true}></Navigate>}
      {currentOrder && currentOrder.paymentMethod === "cash" && (
        <Navigate
          to={`/order-success/${currentOrder.id}`}
          replace={true}
        ></Navigate>
      )}
      {/* {currentOrder && currentOrder.paymentMethod === "card" && (
        <Navigate to={`/stripe-checkout/`} replace={true}></Navigate>
      )} */}
      {status === "loading" ? (
        <Grid
          height="80"
          width="80"
          color="rgb(79, 70, 229) "
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              {/* This form is for address */}
              <form
                className="bg-white px-5 py-12 mt-12"
                noValidate
                onSubmit={handleSubmit((data) => {
                  dispatch(
                    updateUserAsync({
                      ...user,
                      addresses: [...user.addresses, data],
                    })
                  );
                  reset();
                })}
              >
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                      Personal Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Use a permanent address where you can receive mail.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Full name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register("name", {
                              required: "name is required",
                            })}
                            id="name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.name && (
                            <p className="text-red-500">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            {...register("email", {
                              required: "email is required",
                            })}
                            type="email"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.email && (
                            <p className="text-red-500">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Phone
                        </label>
                        <div className="mt-2">
                          <input
                            id="phone"
                            {...register("phone", {
                              required: "phone is required",
                            })}
                            type="tel"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.phone && (
                            <p className="text-red-500">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="street-address"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Street address
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register("street", {
                              required: "street is required",
                            })}
                            id="street"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.street && (
                            <p className="text-red-500">
                              {errors.street.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2 sm:col-start-1">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          City
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register("city", {
                              required: "city is required",
                            })}
                            id="city"
                            autoComplete="address-level2"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.city && (
                            <p className="text-red-500">
                              {errors.city.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          State / Province
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register("state", {
                              required: "state is required",
                            })}
                            id="state"
                            autoComplete="address-level1"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.state && (
                            <p className="text-red-500">
                              {errors.state.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="pinCode"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          ZIP / Postal code
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register("pinCode", {
                              required: "pinCode is required",
                            })}
                            id="pinCode"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.pinCode && (
                            <p className="text-red-500">
                              {errors.pinCode.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      // onClick={e=>reset()}
                      type="button"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Reset
                    </button>
                    <CommonButton
                      type="submit"
                      text={"Add Address"}
                      className="p-0 px-0 py-0"
                    ></CommonButton>
                  </div>
                </div>
              </form>
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Addresses
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Choose from Existing addresses
                </p>
                <ul>
                  {user
                    ? user?.addresses.map((address, index) => (
                        <li
                          key={index}
                          className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200"
                        >
                          <div className="flex gap-x-4">
                            <input
                              onChange={handleAddress}
                              name="address"
                              type="radio"
                              value={index}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm font-semibold leading-6 text-gray-900">
                                {address.name}
                              </p>
                              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                {address.street}
                              </p>
                              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                {address.pinCode}
                              </p>
                            </div>
                          </div>
                          <div className="hidden sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">
                              Phone: {address.phone}
                            </p>
                            <p className="text-sm leading-6 text-gray-500">
                              {address.city}
                            </p>
                          </div>
                        </li>
                      ))
                    : ""}
                </ul>

                <div className="mt-10 space-y-10">
                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                      Payment Methods
                    </legend>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Choose One
                    </p>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          id="cash"
                          name="payments"
                          onChange={handlePayment}
                          value="cash"
                          type="radio"
                          checked={paymentMethod === "cash"}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor="cash"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Cash
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="card"
                          onChange={handlePayment}
                          name="payments"
                          checked={paymentMethod === "card"}
                          value="card"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor="card"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Card Payment
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="bankTransfer"
                          onChange={handlePayment}
                          name="payments"
                          checked={paymentMethod === "bankTransfer"}
                          value="bankTransfer"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor="bankTransfer"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Bank Transfer
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="mx-auto mt-12 bg-white max-w-7xl px-2 sm:px-2 lg:px-4">
                <div className="border-t border-gray-200 px-0 py-6 sm:px-0">
                  <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
                    Cart
                  </h1>
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {items.map((item) => (
                        <li key={item.id} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.product.thumbnail}
                              alt={item.product.title}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <a href={item.product.id}>
                                    {item.product.title}
                                  </a>
                                </h3>

                                <div className="text-gray-600 mb-1 flex gap-3">
                                  <span className="line-through">
                                    ₹{item.product.price * item.quantity}
                                  </span>
                                  <span className="text-blue-500">
                                    ₹
                                    {getDiscountPrice(
                                      user.user_category,
                                      item.product
                                    ) * item.quantity}
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <div>
                                    <small>
                                      GST @ {item?.product?.gstPercentage}%
                                      Inclusive Price{" "}
                                    </small>
                                  </div>
                                </h3>

                                <div className="text-gray-600 mb-1 flex gap-3">
                                  <span className="text-orange-600 font-bold">
                                    ₹
                                    {getGstIncludedPrice(
                                      user.user_category,
                                      item.product
                                    ) * item.quantity}
                                  </span>
                                </div>
                              </div>

                              <div>
                                {item?.product?.stock > 0 ? (
                                  <span className="text-blue-500">
                                    {"IN STOCK"}
                                  </span>
                                ) : (
                                  <span className="text-orange-500">
                                    {"OUT OF STOCK"}
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-between">
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.product.brand}
                                </p>
                                <br />
                                <div className="text-green-600 font-bold text-xl">
                                  {getDiscountPercentage(
                                    user.user_category,
                                    item.product
                                  )}
                                  % Off
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-1 items-end gap-5 text-sm">
                              <div className="text-gray-500">
                                <label
                                  htmlFor={`quantity-${item.id}`}
                                  className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                                >
                                  Qty
                                </label>
                                <select
                                  key={item.id}
                                  id={`quantity-${item.id}`}
                                  onChange={(e) => handleQuantity(e, item)}
                                  value={item.quantity.toString()}
                                >
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                </select>
                              </div>

                              <div className="flex">
                                <button
                                  onClick={(e) => handleRemove(e, item.id)}
                                  type="button"
                                  className="font-medium hover:text-indigo-600 text-gray-600 text-xl"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-2 py-6 sm:px-2">
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>₹ {totalAmount}</p>
                  </div>
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Total Items in Cart</p>
                    <p>{totalItems} items</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <CommonButton
                      buttonClick={handleOrder}
                      text={"Order Now"}
                      // disabled={outOfStock}
                      className="w-full"
                    ></CommonButton>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or
                      <Link to="/home">
                        <button
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <BankDetailsModal
        isOpen={isOpen}
        onClose={closeModal}
        bankDetails={bankDetails}
        handleTransfer={handleTransfer}
        setReferenceNumber={setReferenceNumber}
      />
      ;
    </>
  );
}

export default Checkout;
