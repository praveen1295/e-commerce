import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDiscountPercentage, getDiscountPrice } from "../../utils";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../auth/authSlice";
import { selectUserInfo } from "../user/userSlice";

const CommonProductCard = ({ product, cardClick }) => {
  const userInfo = useSelector(selectUserInfo);

  const navigate = useNavigate();
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountPrice, setDiscountPricePrice] = useState(0);

  useEffect(() => {
    if (product) {
      setDiscountPercentage(
        getDiscountPercentage(userInfo?.user_category, product)
      );
      setDiscountPricePrice(getDiscountPrice(userInfo?.user_category, product));
    }
  }, [userInfo, product]);

  return (
    <div
      className="relative max-w-xs bg-white border border-gray-200 rounded-lg shadow text-gray-950 font-medium cursor-pointer hover:bg-gray-200"
      style={{ height: "330px" }} // Set a fixed height for the card
      onClick={
        cardClick
          ? () => cardClick()
          : () => navigate(`/product-detail/${product.id}`)
      }
    >
      {discountPercentage && (
        <div className="absolute top-0 right-0 z-10 bg-sky-500 text-white py-1 px-2 rounded-tr-lg">
          {discountPercentage}% Off
        </div>
      )}
      <div className="aspect-w-16 aspect-h-9">
        <img
          className="object-cover rounded-t-lg"
          src={product.thumbnail}
          alt=""
        />
      </div>
      <div className="p-3">
        <h4 className="mb-2 text-normal font-bold tracking-tight text-gray-700">
          {product.title.length > 25
            ? `${product.title.slice(0, 25)}...`
            : product.title}
        </h4>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-none">
          {product.description.length > 40
            ? `${product.description.slice(0, 40)}...`
            : product.description}
        </p>
        <div className="text-gray-600 mb-3 flex gap-3">
          <span className="text-blue-500">₹{discountPrice}</span>
          {discountPrice < product?.price && (
            <span className="line-through">₹{product.price}</span>
          )}
        </div>
        <hr className="py-1" />
        {discountPrice < product?.price && (
          <span className="text-green-500">
            Save ₹{product.price - discountPrice}
          </span>
        )}
      </div>
    </div>
  );
};

export default CommonProductCard;
