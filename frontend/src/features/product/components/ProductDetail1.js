import React, { useEffect, useState } from "react";
import ReactImageMagnify from "react-image-magnify";
import CommonProductCard from "../../common/CommonProductCard";
import data from "../../../data.json";
import Description from "./Description";
import AdditionalInfo from "./AdditionalInfo";
import Reviews from "./Reviews";
import {
  fetchProductByIdAsync,
  fetchRelatedProductsAsync,
  selectProductById,
  selectProductListStatus,
  selectRelatedProducts,
} from "../productSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCartAsync,
  fetchItemsByUserIdAsync,
  selectItems,
} from "../../cart/cartSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { selectUserInfo } from "../../user/userSlice";
import {
  getDiscountPercentage,
  getDiscountPrice,
  getGstIncludedPrice,
} from "../../../utils";
import Loader from "../../common/Loader";

const ProductDetail1 = () => {
  const navigate = useNavigate();
  const detailHeadings = ["Description", "Additional Information", "Reviews"];
  const userInfo = useSelector(selectUserInfo);
  const relatedProducts = useSelector(selectRelatedProducts);

  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const items = useSelector(selectItems);
  const product = useSelector(selectProductById);
  const dispatch = useDispatch();
  const params = useParams();
  const alert = useAlert();
  const status = useSelector(selectProductListStatus);
  const [quantity, setQuantity] = useState(1);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleCart = (e) => {
    e.preventDefault();
    if (!userInfo) {
      alert.error("Please login to add to cart");
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
      alert.error("Item already added");
    }
  };

  useEffect(() => {
    if (product) {
      setDiscountPercentage(
        getDiscountPercentage(userInfo?.user_category, product)
      );
      setDiscountPrice(getDiscountPrice(userInfo?.user_category, product));
      const imgArr = [product?.thumbnail, ...product?.images];
      setSelectedImage(imgArr[0]);
    }

    if (product?.relatedProducts?.length > 0) {
      const skus = product.relatedProducts.join(",");
      dispatch(fetchRelatedProductsAsync({ skus, id: product?.id }));
    }
  }, [userInfo, product]);

  useEffect(() => {
    dispatch(fetchProductByIdAsync(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (quantity > 1) {
    }
  }, [quantity]);

  const handleCardClick = () => {};

  if (status === "loading") {
    <Loader />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-7">
      <section className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4">
          <div className="flex">
            <div className="w-1/5 bg-gray-200 p-4 flex flex-col gap-4">
              {product?.images &&
                [product?.thumbnail, ...product?.images].map((image, idx) => (
                  <div
                    key={idx}
                    className="w-full cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img className="w-full max-h-24" src={image} />
                  </div>
                ))}
            </div>
            <div className="w-4/5 bg-white p-4 flex items-center justify-center">
              <div className="productDetailImage relative w-full">
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: "Wristwatch by Ted Baker London",
                      isFluidWidth: true,
                      src: selectedImage ? selectedImage : "",
                      style: { maxHeight: "9rem", objectFit: "contain" },
                    },
                    largeImage: {
                      src: selectedImage ? selectedImage : "",
                      width: 800,
                      height: 700,
                    },
                    lensStyle: { backgroundColor: "rgba(0,0,0,0.6)" },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 px-4">
          <div className="bg-white p-4">
            <h2 className="text-3xl font-medium mb-2">{product?.title}</h2>
            <div className="mb-2">
              <div>
                {product && product?.stock > 0 ? (
                  <span className="text-blue-500">{"IN STOCK"}</span>
                ) : (
                  <span className="text-orange-500">{"OUT OF STOCK"}</span>
                )}
              </div>
              <div className="mb-0 flex gap-4 text-xl font-bold">
                <span className="text-gray-600">
                  Rs. {discountPrice || product?.price}
                </span>

                {discountPrice < product?.price && (
                  <span
                    style={{
                      textDecoration: "line-through",
                    }}
                    className="text-gray-400"
                  >
                    ₹ {product?.price}
                  </span>
                )}
                <span className="text-blue-400">
                  {getDiscountPercentage(userInfo?.user_category, product)}% OFF
                </span>
              </div>

              <small>
                GST @ {product?.gstPercentage}% Inclusive Price{" "}
                <span className="text-orange-600 text-sm font-bold">
                  ₹ {getGstIncludedPrice(userInfo?.user_category, product)}
                </span>
              </small>
            </div>

            <div className="flex mb-2">
              <div className="flex">
                <div className="text-yellow-500 text-xl">
                  {product?.rating
                    ? [...Array(5).keys()].map((index) =>
                        index < Math.ceil(product.rating) ? "★" : "☆"
                      )
                    : "No rating"}
                  <small className="text-gray-500">
                    |{" "}
                    {product?.rating
                      ? `${product.rating} Customer review${
                          product.rating > 1 ? "s" : ""
                        }`
                      : "No reviews"}
                  </small>
                </div>
              </div>
            </div>
            <small className="mb-5 text-gray-800">{product?.description}</small>
            <div className="flex justify-start gap-10 my-10">
              <div className="flex items-center justify-between border-solid border-2 bg-blue-900 border-violet-600 text-white font-normal w-32 rounded-full overflow-hidden">
                <button
                  onClick={decreaseQuantity}
                  className="hover:bg-red-500 text-white font-bold py-3 pl-2 pr-4"
                >
                  -
                </button>
                <input
                  className="w-1/2 focus:outline-none focus:ring-0 border-none text-center bg-blue-900"
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <button
                  onClick={increaseQuantity}
                  className="hover:bg-green-600 text-white font-bold py-3 pl-4 pr-2"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleCart}
                className="hover:bg-blue-600 border-solid border-2 bg-blue-900 border-violet-600 text-white font-normal px-4 py-2 w-32 rounded-full"
              >
                Add to Cart
              </button>
              {/* <button className="hover:bg-green-600 border-solid border-2 border-sky-500 font-normal px-4 py-2 w-32 rounded-full">
                Compare
              </button> */}
            </div>
            <hr className="my-4" />

            <section className="flex gap-4 text-gray-500">
              <div className="flex gap-9">
                <span>Highlight:</span>
              </div>
              <div className="">
                {product?.highlights.map((highlight, idx) => (
                  <div key={idx}>{highlight}</div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
      <hr className="my-4" />
      <section>
        <div className="flex justify-center gap-10 py-5 text-gray-600">
          {detailHeadings.map((item, idx) => (
            <div
              key={idx}
              className={`text-xl cursor-pointer ${
                highlightedIndex === idx ? "font-bold text-xl text-black" : ""
              }`}
              onClick={() => setHighlightedIndex(idx)}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mx-4 sm:mx-10 lg:mx-32">
          {highlightedIndex === 0 ? (
            <Description product={product} />
          ) : highlightedIndex === 1 ? (
            <AdditionalInfo product={product} />
          ) : highlightedIndex === 2 ? (
            <Reviews productId={product?.id} userId={userInfo?.id} />
          ) : null}

          <hr className="my-4" />
          <section className="relateProducts flex flex-col justify-center items-center">
            <span className="text-3xl font-bold">Related Products</span>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {relatedProducts &&
                relatedProducts?.slice(0, 4).map((product, idx) => (
                  <div key={idx}>
                    <CommonProductCard product={product} userInfo={userInfo} />
                  </div>
                ))}
            </div>
            <button
              type="button"
              onClick={() => {
                navigate("/productLists");
              }}
              className="py-2.5 px-10 me-2 mb-2 text-sm font-medium text-yellow-600 focus:outline-none bg-white border border-yellow-600 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 my-5 rounded-full"
            >
              Show More
            </button>
          </section>
        </div>
      </section>
      <hr className="mt-10" />
    </div>
  );
};

export default ProductDetail1;
