import React, { useEffect, useState } from "react";
import CommonProductCard from "../common/CommonProductCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import data from "../../data.json";
import {
  fetchBrandsAsync,
  fetchProductsByFiltersAsync,
  getCategoryCountsAsync,
  selectAllProducts,
  selectCategoryCounts,
  selectProductListStatus,
  selectTotalItems,
} from "../product/productSlice";
import { ITEMS_PER_PAGE } from "../../app/constants";
import { selectUserInfo } from "../user/userSlice";
import Loader from "../common/Loader";
import {
  fetchAllCategoriesAsync,
  selectCategories,
} from "../categories/categorySlice";

const ShopProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const status = useSelector(selectProductListStatus);

  const userInfo = useSelector(selectUserInfo);
  const totalItems = useSelector(selectTotalItems);
  const categoriesCounts = useSelector(selectCategoryCounts);

  const [sort, setSort] = useState({});
  const [categoriesProduct, setCategoriesProduct] = useState([]);

  const products = useSelector(selectAllProducts);

  function getRandomPageNumber(totalItems, itemPerPage = 2) {
    if (totalItems <= 0 || itemPerPage <= 0) {
      return 1;
    }

    const maxPage = Math.ceil(totalItems / itemPerPage);

    return Math.floor(Math.random() * maxPage) + 1;
  }

  const handleShowAll = (category) => {
    navigate("/productLists", {
      state: { products: data.products, category },
    });
  };

  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchAllCategoriesAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategoryCountsAsync({ categories, admin: false }));
  }, [categories, dispatch]);

  useEffect(() => {
    if (categoriesCounts) {
      const fetchPromises = categories.map((category) => {
        const pagination = {
          _page: getRandomPageNumber(
            categoriesCounts[category.value],
            ITEMS_PER_PAGE
          ),
          _limit: ITEMS_PER_PAGE,
        };

        return dispatch(
          fetchProductsByFiltersAsync({
            filter: { category: category.value },
            sort,
            pagination,
            admin: false,
          })
        );
      });

      Promise.allSettled(fetchPromises).then((results) => {
        const arr = results.map((result, index) => {
          if (result.status === "fulfilled") {
            return result.value.payload.products;
          } else {
            console.error(
              `Error occurred for category ${categories[index].value}:`,
              result.reason
            );
            return [];
          }
        });

        setCategoriesProduct(arr);
      });
    }
  }, [dispatch, categoriesCounts, categories, sort]);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {categoriesProduct?.length ? (
        categories.map((category, index) => (
          <React.Fragment key={category.value}>
            {categoriesProduct[index]?.length ? (
              <section className="section-1 mb-7">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                  {category?.label}
                </h1>
                <div className="bg-blue-500 h-1 w-1/3 mb-4"></div>
                <div className="flex justify-end items-center mb-4">
                  <span
                    className="text-right text-blue-600 font-bold cursor-pointer"
                    onClick={() => handleShowAll(category)}
                  >
                    Show All...
                  </span>
                </div>
                {status === "loading" ? (
                  <Loader />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {categoriesProduct[index]
                      ?.slice(0, 5)
                      .map((product, idx) => (
                        <div key={idx}>
                          <CommonProductCard
                            product={product}
                            userInfo={userInfo}
                          />
                        </div>
                      ))}
                  </div>
                )}
              </section>
            ) : null}
          </React.Fragment>
        ))
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default ShopProducts;
