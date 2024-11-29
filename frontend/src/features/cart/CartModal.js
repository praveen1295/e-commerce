import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteItemFromCartAsync,
  selectCartLoaded,
  selectCartStatus,
  selectItems,
  updateCartAsync,
} from "./cartSlice";
import Modal from "../common/Modal";

import { useDispatch, useSelector } from "react-redux";
import { getGstIncludedPrice } from "../../utils";
import { selectUserInfo } from "../user/userSlice";
import CommonButton from "../common/CommonButton";

const ShoppingCartModal = ({ isOpen, onClose, grandTotal }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const cartProducts = useSelector(selectItems);
  const [cartTotal, setCartTotal] = useState(0);
  const [openModal, setOpenModal] = useState(null);
  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };

  useEffect(() => {
    let t = 0;
    cartProducts.forEach((item) => {
      t +=
        getGstIncludedPrice(userInfo?.user_category, item.product) *
        item.quantity;
    });
    setCartTotal(t);
  }, [cartProducts]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed bg-white h-screen top-0 right-0 w-1/3 shadow-lg p-4"
          style={{ zIndex: 1000 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Shopping Cart</h2>
            <button
              className="text-red-600 text-xl font-bold hover:text-gray-700 focus:outline-none"
              onClick={onClose}
              type={"button"}
            >
              &#10005;
            </button>
          </div>
          {/* Product cards list */}
          <div className="mb-4">
            {cartProducts.map((item, index) => {
              return (
                <div className="relative">
                  <div
                    key={item.product?.id}
                    className="border border-gray-300 p-2 mb-2  flex items-center"
                  >
                    <img
                      src={item.product?.thumbnail}
                      alt={item.product?.title}
                      className="w-16 h-16 mr-2"
                    />

                    <div>
                      <p className="font-semibold">{item.product?.title}</p>
                      <p>
                        {item.quantity}
                        {"   X   "}
                        <span className="text-yellow-600">
                          ₹
                          {getGstIncludedPrice(
                            userInfo?.user_category,
                            item.product
                          ) || item.product?.price}
                        </span>
                      </p>
                    </div>
                    <button
                      className="absolute right-0 p-1 font-bold  text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => setOpenModal(item.product?.id)}
                    >
                      &#10005;
                    </button>
                    {/* <div className="flex items-center">
                  <span>Quantity: {quantity}</span>
                </div> */}
                  </div>

                  <Modal
                    title={`Delete ${item.product?.title}`}
                    message="Are you sure you want to delete this Cart item ?"
                    dangerOption="Delete"
                    cancelOption="Cancel"
                    dangerAction={(e) => handleRemove(e, item.id)}
                    cancelAction={() => setOpenModal(null)}
                    showModal={openModal === item.product.id}
                  ></Modal>
                </div>
              );
            })}
          </div>
          {/* Grand total */}
          <div className="mb-4">
            <p className="text-lg font-bold">Subtotal: {cartTotal}</p>
          </div>
          {/* Buttons */}
          <div className="flex justify-start gap-4">
            <Link to={"/cart"}>
              <CommonButton
                className="w-32"
                // buttonClick={onClose}
                type={"button"}
                text="Cart"
              ></CommonButton>
            </Link>
            <Link
              to="/checkout"
              // className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              <CommonButton
                className="w-32"
                // buttonClick={onClose}
                type={"button"}
                text="Checkout"
              ></CommonButton>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCartModal;
