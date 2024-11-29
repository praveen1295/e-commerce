import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemFromCartAsync,
  selectCartLoaded,
  selectCartStatus,
  selectItems,
  updateCartAsync,
} from "./cartSlice";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Grid } from "react-loader-spinner";
import Modal from "../common/Modal";
import { selectUserInfo } from "../user/userSlice";
import { getDiscountPercentage, getGstIncludedPrice } from "../../utils";

export default function Cart() {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const items = useSelector(selectItems);

  // useEffect(() => {
  //   setDiscountPrice(getGstIncludedPrice(userInfo?.user_category, items));
  // }, [userInfo, items]);

  // const items1 = [
  //   {
  //     quantity: 1,
  //     product: {
  //       colors: [],
  //       sizes: [],
  //       highlights: [],
  //       id: "65ec300eff23452df10cf459",
  //       title: "Product Seven",
  //       description: "Description of Product Seven",
  //       price: 120,
  //       discountPercentage: 12.7,
  //       discountPrice: 500,
  //       rating: 4.7,
  //       stock: 20,
  //       brand: "BrandB",
  //       category: "Health & Wellness",
  //       thumbnail: "/assets/product3.jpeg",
  //       images: [
  //         "/assets/product7.jpeg",
  //         "/assets/product7_2.jpeg",
  //         "/assets/product7_3.jpeg",
  //         "/assets/product7_4.jpeg",
  //       ],
  //       deleted: false,
  //     },
  //     user: "65e6c1159b8ca13e67fb8519",
  //     id: "65ee9ca3f35f819409145f5f",
  //   },
  //   {
  //     quantity: 1,
  //     product: {
  //       colors: [],
  //       sizes: [],
  //       highlights: [],
  //       id: "65ec300eff23452df10cf456",
  //       title: "Product Four",
  //       description: "Description of Product Four",
  //       price: 250,
  //       discountPercentage: 12.7,
  //       discountPrice: 500,
  //       rating: 3.8,
  //       stock: 5,
  //       brand: "BrandY",
  //       category: "Appliances",
  //       thumbnail: "/assets/product4.jpeg",
  //       images: [
  //         "/assets/product4.jpeg",
  //         "/assets/product4_2.jpeg",
  //         "/assets/product4_3.jpeg",
  //         "/assets/product4_4.jpeg",
  //       ],
  //       deleted: false,
  //     },
  //     user: "65e6c1159b8ca13e67fb8519",
  //     id: "65ee9d22f35f819409145f88",
  //   },
  // ];

  const status = useSelector(selectCartStatus);
  const cartLoaded = useSelector(selectCartLoaded);
  const [openModal, setOpenModal] = useState(null);

  const totalAmount = items?.reduce(
    (amount, item) =>
      item.product?.gstIncludedPrice[userInfo.user_category] * item.quantity +
      amount,
    0
  );
  const totalItems = items?.reduce((total, item) => item.quantity + total, 0);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };

  return (
    <>
      {/* {!items?.length && cartLoaded && (
        <Navigate to="/home" replace={true}></Navigate>
      )} */}

      <div>
        <div className="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
              Cart
            </h1>
            <div className="flow-root">
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
              ) : null}
              <ul className="-my-6 divide-y divide-gray-200">
                {items?.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product?.thumbnail}
                        alt={item.product?.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a href={item.product?.id}>{item.product?.title}</a>
                          </h3>
                          <div className="text-gray-600 mb-3 flex gap-3">
                            <span className="line-through">
                              ${item.product?.price * item.quantity}
                            </span>
                            <span className="text-blue-500">
                              $
                              {getGstIncludedPrice(
                                userInfo.user_category,
                                item.product
                              ) * item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <p className="mt-1 text-sm text-gray-500">
                            {item.product?.brand}
                          </p>
                          <br />
                          <div className="text-green-600 font-bold text-xl">
                            {getDiscountPercentage(
                              userInfo.user_category,
                              item.product
                            )}
                            % Off
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end gap-10 text-sm">
                        <div className="text-gray-500">
                          <label
                            htmlFor="quantity"
                            className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                          >
                            Qty
                          </label>
                          <select
                            onChange={(e) => handleQuantity(e, item)}
                            value={item.quantity}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>

                        <div className="flex">
                          <Modal
                            title={`Delete ${item.product?.title}`}
                            message="Are you sure you want to delete this Cart item ?"
                            dangerOption="Delete"
                            cancelOption="Cancel"
                            dangerAction={(e) => handleRemove(e, item.id)}
                            cancelAction={() => setOpenModal(null)}
                            showModal={openModal === item.id}
                          ></Modal>
                          <button
                            onClick={(e) => {
                              setOpenModal(item.id);
                            }}
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

          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <div className="flex justify-between my-2 text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>$ {totalAmount}</p>
            </div>
            <div className="flex justify-between my-2 text-base font-medium text-gray-900">
              <p>Total Items in Cart</p>
              <p>{totalItems} items</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Checkout
              </Link>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
              <p>
                {"or "}
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
    </>
  );
}
