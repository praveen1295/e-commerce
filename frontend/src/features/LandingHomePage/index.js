import React, { useEffect } from "react";
import Slider from "./Slider";
import CardSlider from "./CardSlider";
import { responsive, productData } from "./data";
import SubscribeForm from "./SubscribeForm";
import CommonButton from "../common/CommonButton";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBestSellersAsync,
  fetchBrandsAsync,
  fetchAllCategoriesAsync,
  fetchProductsByFiltersAsync,
  selectAllProducts,
  selectBestSellers,
  selectBrands,
  selectCategories,
  selectProductListStatus,
  selectTotalItems,
} from "../product/productSlice";
import {
  fetchAllBlogsAsync,
  selectBlogs,
  deleteBlogAsync,
  fetchMostViewedBlogsAsync,
  selectMostViewedBlogs,
} from "../Blogs/blogsSlice";
import { ITEMS_PER_PAGE } from "../../app/constants";
import { useNavigate } from "react-router-dom";
import {
  fetchAllBannersAsync,
  selectBannerListStatus,
  selectBanners,
} from "../Banners/bannersSlice";
import Loader from "../common/Loader";
import ShowBlogs from "./ShowBlogs";
import BestSellingCard from "./BestSellingCard";

const LandingHomePage = () => {
  const mostViewedBlogs = useSelector(selectMostViewedBlogs);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectAllProducts);
  const bannerLoading = useSelector(selectBannerListStatus);

  const bestSellers = useSelector(selectBestSellers);
  const banners = useSelector(selectBanners);

  const blogs = useSelector(selectBlogs);

  const handleShopNow = () => {
    navigate("/shop/products");
  };
  const handleByNow = () => {
    navigate("/shop/products");
  };

  useEffect(() => {
    dispatch(fetchAllBannersAsync({}));
    const pagination = { _page: 1, _limit: ITEMS_PER_PAGE };
    dispatch(fetchProductsByFiltersAsync({ pagination }));
    dispatch(fetchBestSellersAsync());

    dispatch(fetchAllBlogsAsync({ sort: {}, filters: {}, pagination }));
    dispatch(fetchMostViewedBlogsAsync({ sort: {}, filters: {}, pagination }));
  }, [dispatch]);

  if (bannerLoading === "loading") {
    return <Loader />;
  }

  return (
    <div className="font-sans">
      <Slider />
      <div className="container-2 px-2 md:px-4 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 mt-7">
          <div className="bg-gray-100 p-5 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-5">
              Medical Supplies
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              All of your medical supplies in one place, with frequent offers
              <br />
              and quick delivery times
            </p>
            <CommonButton buttonClick={handleByNow} text={"Buy Now"} />
          </div>
          <div className="bg-blue-950 p-5 text-white flex-none">
            <h3 className="text-xl md:text-2xl font-bold mb-5">Get Up To</h3>
            <h1 className="text-3xl md:text-5xl font-bold mb-5">35% OFF</h1>
            <p className="text-xs md:text-sm">
              With top brands, in our offers and <br />
              clearance section, whilst stocks last.
            </p>
          </div>
          <div className="bg-white p-5 w-full md:w-1/3 hidden md:block">
            <ShowBlogs blogs={mostViewedBlogs} heading={"Most Viewed Blogs"} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-7">
          <div className="bg-blue-950 p-5 text-white flex-none">
            <h1 className="text-2xl md:text-3xl font-bold mb-5">
              Trusted Brands
            </h1>
            <p className="text-xs md:text-sm mb-4">
              With top brands, in our offers and <br />
              clearance section, whilst stocks last.
            </p>
            <div className="flex flex-col gap-2">
              {["3M Littmann", "Welch Allyn", "Seca"].map((item, idx) => {
                return (
                  <div className="flex items-center gap-2" key={idx}>
                    <img src="assets/trustedBrand.svg" alt="" />
                    <p className="text-xs md:text-sm">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-gray-100 p-5 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-5">
              Hospital Equipment
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              We hold the widest range of medical equipment available to the UK.
              <br />
              and quick delivery times
            </p>
            <CommonButton buttonClick={handleByNow} text={"Shop Now"} />
          </div>
          <div className="bg-white p-5 w-full md:w-1/3  md:hidden">
            <ShowBlogs blogs={mostViewedBlogs} heading={"Most Viewed Blogs"} />
          </div>
          <div className="bg-white p-5 w-full md:w-1/3">
            <ShowBlogs blogs={blogs} heading={"Latest Blogs"} />
          </div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col items-center justify-center mt-7 space-y-10 px-4">
        <div className="section text-center py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Best Selling Products
          </h1>
          <h4 className="text-base md:text-lg font-bold text-gray-600 my-4 md:my-7">
            View our best sellers and essential medical supplies & equipment
          </h4>
          <CommonButton buttonClick={handleShopNow} text={"Shop Now"} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 py-0">
          {bestSellers?.map((bestSeller, idx) => (
            <BestSellingCard product={bestSeller} />
            // <div
            //   key={idx}
            //   className="w-40 sm:w-48 md:w-60 h-40 sm:h-48 md:h-60 bg-gray-100 p-4 flex flex-col items-center justify-center cursor-pointer"
            //   onClick={() => navigate(`/product-detail/${bestSeller.id}`)}
            // >
            //   <img
            //     src={bestSeller.thumbnail}
            //     alt="Product Image"
            //     className="w-20 h-20 sm:w-24 sm:h-24 mb-2"
            //   />
            //   <span className="text-base sm:text-lg md:text-xl">
            //     {bestSeller?.title}
            //   </span>
            // </div>
          ))}
        </div>

        <div className="our-products-section w-full px-4 md:px-16">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Our Products
            </h1>
            <h4 className="text-base md:text-lg font-bold text-gray-600 my-4 md:my-7">
              Problems trying to resolve the conflict between{" "}
              <br className="hidden md:block" />
              the two major realms of Classical physics: Newtonian mechanics
            </h4>
          </div>
          <div className="py-0">
            {/* <CardSlider data={{ responsive, productData: products }} /> */}

            <CardSlider products={products} />
          </div>
        </div>

        <div className="subscribe-section w-full px-4 md:px-16 py-10 flex flex-col items-center text-center space-y-4 md:space-y-7">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Subscribe to Our Newsletter
          </h1>
          <h4 className="text-base md:text-lg font-bold text-gray-600">
            Sign-up to get the latest offers and news and stay updated
          </h4>
          <div className="w-full max-w-3xl">
            <SubscribeForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHomePage;
