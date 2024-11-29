import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserInfo } from "../user/userSlice";
import { getGstIncludedPrice } from "../../utils";
import { addToCartAsync, selectItems } from "../cart/cartSlice";
import { selectProductById } from "../product/productSlice";
import { useAlert } from "react-alert";

export default function Product(props) {
  const items = useSelector(selectItems);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const userInfo = useSelector(selectUserInfo);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();

  const handleCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) {
      alert.error("Please login for add to cart");
      navigate("/login");
      return;
    }
    if (items.findIndex((item) => item.product.id === product.id) < 0) {
      const newItem = {
        product: product.id,
        quantity: quantity,
      };
      if (selectedColor) {
        newItem.color = selectedColor;
      }
      if (selectedSize) {
        newItem.size = selectedSize;
      }
      dispatch(addToCartAsync({ item: newItem, alert }));
    } else {
      alert.error("Item Already added");
    }
  };

  useEffect(() => {
    setDiscountPrice(getGstIncludedPrice(userInfo?.user_category, props));
  }, [userInfo, props]);

  function truncateDescription(description) {
    const words = description.split(" ");
    if (words.length > 12) {
      // Adjusted to fit two lines
      return words.slice(0, 12).join(" ") + "...";
    } else {
      return description;
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 mr-4 border border-gray-400 cursor-pointer w-full max-w-xs mx-auto"
      onClick={() => navigate(`/product-detail/${props.id}`)}
    >
      <img
        className="w-full h-48 object-cover rounded-md"
        src={props.url}
        alt="product image"
      />
      <div>
        <h2 className="text-lg font-semibold mt-2 truncate">{props.title}</h2>
        <p className="text-gray-600 mt-1">
          <span className="text-blue-500">
            ${discountPrice ? discountPrice : ""}
          </span>{" "}
          <span className="line-through">${props.price}</span>
        </p>
        <p className="mt-2 text-gray-700 line-clamp-2 h-16">
          {truncateDescription(props.description)}
        </p>

        <p className="mt-4">
          <button
            className="bg-blue-950 text-white px-4 py-2 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={(e) => handleCart(e, props)}
          >
            Add to Cart
          </button>
        </p>
      </div>
    </div>
  );
}
