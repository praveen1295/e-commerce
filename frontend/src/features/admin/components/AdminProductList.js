import React, { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBrandsAsync,
  fetchProductsByFiltersAsync,
  selectAllProducts,
  selectBrands,
  selectTotalItems,
} from "../../product/productSlice";

import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import { Pagination } from "antd";
import {
  fetchAllCategoriesAsync,
  selectCategories,
} from "../../categories/categorySlice";
import { selectUserInfo } from "../../user/userSlice";

const sortOptions = [
  { name: "Best Rating", sort: "rating", order: "desc", current: false },
  {
    name: "Price: Low to High",
    sort: "discountPrice",
    order: "asc",
    current: false,
  },
  {
    name: "Price: High to Low",
    sort: "discountPrice",
    order: "desc",
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminProductList() {
  const userInfo = useSelector(selectUserInfo);

  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const totalItems = useSelector(selectTotalItems);
  const filters = [
    {
      id: "category",
      name: "Category",
      options: categories,
    },
    {
      id: "brand",
      name: "Brands",
      options: brands,
    },
  ];

  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);

  const onShowSizeChange = (current, size) => {
    setPageSize(size);
  };
  const handleFilter = (e, section, option) => {
    const newFilter = { ...filter };
    if (e.target.checked) {
      if (newFilter[section.id]) {
        newFilter[section.id].push(option.value);
      } else {
        newFilter[section.id] = [option.value];
      }
    } else {
      const index = newFilter[section.id].findIndex(
        (el) => el === option.value
      );
      newFilter[section.id].splice(index, 1);
    }

    setFilter(newFilter);
  };

  const handleSort = (e, option) => {
    const sort = { _sort: option.sort, _order: option.order };
    setSort(sort);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: pageSize };
    dispatch(
      fetchProductsByFiltersAsync({ filter, sort, pagination, admin: true })
    );
  }, [dispatch, filter, sort, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [totalItems, sort]);

  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchAllCategoriesAsync());
  }, []);

  return (
    <div className="bg-white">
      <div>
        <MobileFilter
          handleFilter={handleFilter}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          filters={filters}
        ></MobileFilter>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              All Products
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <p
                              onClick={(e) => handleSort(e, option)}
                              className={classNames(
                                option.current
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              {option.name}
                            </p>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <DesktopFilter
                handleFilter={handleFilter}
                filters={filters}
              ></DesktopFilter>
              {/* Product grid */}

              <div className="lg:col-span-3">
                <div>
                  <Link
                    to={
                      userInfo?.role === "admin" ? "#" : "/admin/product-form"
                    }
                    className={`rounded-md mx-10 my-5 px-3 py-2 text-sm font-semibold text-white shadow-sm 
    ${
      userInfo?.role === "admin"
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-700 hover:bg-green-500"
    }
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    onClick={(e) =>
                      userInfo?.role === "admin" && e.preventDefault()
                    }
                  >
                    Add New Product
                  </Link>
                </div>
                <ProductGrid products={products}></ProductGrid>
              </div>
              {/* Product grid end */}
            </div>
          </section>

          {/* section of product and filters ends */}
          {/* <Pagination
            page={page}
            setPage={setPage}
            handlePage={handlePage}
            totalItems={totalItems}
          ></Pagination> */}

          <div className="flex justify-center mt-5">
            <Pagination
              showSizeChanger={true}
              onShowSizeChange={onShowSizeChange}
              defaultCurrent={page}
              total={totalItems}
              pageSize={pageSize}
              onChange={(page) => setPage(page)}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileFilter({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  handleFilter,
  filters,
}) {
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={setMobileFiltersOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-6">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  onChange={(e) =>
                                    handleFilter(e, section, option)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="ml-3 min-w-0 flex-1 text-gray-500"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function DesktopFilter({ handleFilter, filters }) {
  return (
    <form className="hidden lg:block">
      {filters.map((section) => (
        <Disclosure
          as="div"
          key={section.id}
          className="border-b border-gray-200 py-6"
        >
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">
                    {section.name}
                  </span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-4">
                  {section.options.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`filter-${section.id}-${optionIdx}`}
                        name={`${section.id}[]`}
                        defaultValue={option.value}
                        type="checkbox"
                        defaultChecked={option.checked}
                        onChange={(e) => handleFilter(e, section, option)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`filter-${section.id}-${optionIdx}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </form>
  );
}

// function Pagination({ page, setPage, handlePage, totalItems }) {
//   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
//   return (
//     <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
//       <div className="flex flex-1 justify-between sm:hidden">
//         <div
//           onClick={(e) => handlePage(page > 1 ? page - 1 : page)}
//           className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//         >
//           Previous
//         </div>
//         <div
//           onClick={(e) => handlePage(page < totalPages ? page + 1 : page)}
//           className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//         >
//           Next
//         </div>
//       </div>
//       <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//         <div>
//           <p className="text-sm text-gray-700">
//             Showing{" "}
//             <span className="font-medium">
//               {(page - 1) * ITEMS_PER_PAGE + 1}
//             </span>{" "}
//             to{" "}
//             <span className="font-medium">
//               {page * ITEMS_PER_PAGE > totalItems
//                 ? totalItems
//                 : page * ITEMS_PER_PAGE}
//             </span>{" "}
//             of <span className="font-medium">{totalItems}</span> results
//           </p>
//         </div>
//         <div>
//           <nav
//             className="isolate inline-flex -space-x-px rounded-md shadow-sm"
//             aria-label="Pagination"
//           >
//             <div
//               onClick={(e) => handlePage(page > 1 ? page - 1 : page)}
//               className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
//             >
//               <span className="sr-only">Previous</span>
//               <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
//             </div>
//             {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}

//             {Array.from({ length: totalPages }).map((el, index) => (
//               <div
//                 key={index}
//                 onClick={(e) => handlePage(index + 1)}
//                 aria-current="page"
//                 className={`relative cursor-pointer z-10 inline-flex items-center ${
//                   index + 1 === page
//                     ? "bg-indigo-600 text-white"
//                     : "text-gray-400"
//                 } px-4 py-2 text-sm font-semibold  focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
//               >
//                 {index + 1}
//               </div>
//             ))}

//             <div
//               onClick={(e) => handlePage(page < totalPages ? page + 1 : page)}
//               className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
//             >
//               <span className="sr-only">Next</span>
//               <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
//             </div>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// }

function ProductGrid({ products }) {
  const dispatch = useDispatch();
  // const totalUsers = useSelector(selectTotalUsers);
  const userInfo = useSelector(selectUserInfo);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({});
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [update, setUpdate] = useState({});

  // const users = useSelector(selectUsers);
  const [editableUserId, setEditableUserId] = useState(-1);

  const handleEdit = (user) => {
    setEditableUserId(user.id);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleUserCategory = (e, user) => {
    setUpdate({ ...update, user_category: e.target.value });
    // dispatch(updateUserAsync(update));
    // setEditableUserId(-1);
  };

  const handleUserStatus = (e, user) => {
    setUpdate({ ...update, user_status: e.target.value });

    // dispatch(updateUserAsync(updatedUser));
    // setEditableUserId(-1);
  };

  const handleSave = (user) => {
    // dispatch(updateUserAsync({ id: user.id, ...update }));

    setEditableUserId(-1);
  };

  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    setSort(sort);
  };

  const chooseColor = (status) => {
    switch (status) {
      case "regular":
        return "bg-blue-200 text-blue-600";
      case "gold":
        return "bg-yellow-200 text-yellow-600";
      case "silver":
        return "bg-gray-200 text-gray-600";
      case "active":
        return "bg-green-200 text-green-600";
      case "inactive":
        return "bg-red-200 text-red-600";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  // useEffect(() => {
  //   const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
  //   const filters = {
  //     user_category: selectedCategory.map((cat) => cat.value).join(","),
  //     user_status: selectedStatus.map((stat) => stat.value).join(","),
  //   };
  //   dispatch(fetchAllUsersAsync({ sort, ...filters, pagination }));
  // }, [dispatch, page, sort, selectedStatus, selectedCategory, editableUserId]);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const categoryOptions = [
    { value: "regular", label: "Regular" },
    { value: "gold", label: "Gold" },
    { value: "silver", label: "Silver" },
  ];

  const handleStatusChange = (selectedOptions) => {
    setSelectedStatus(selectedOptions || []);
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategory(selectedOptions || []);
  };

  const isEditable = (userId) => userId === editableUserId;

  return (
    <div className="overflow-x-auto">
      <div className="bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
        <div className="w-full">
          <div className="bg-white shadow-md rounded my-6">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-0 text-left cursor-pointer">
                    Thumbnail
                  </th>
                  <th className="py-3 px-0 text-left cursor-pointer">Name</th>
                  <th className="py-3 px-0 text-left cursor-pointer">
                    Category
                  </th>
                  <th className="py-3 px-0 text-left cursor-pointer">Price</th>
                  <th className="py-3 px-0 text-left cursor-pointer">SKU</th>
                  <th className="py-3 px-0 text-left cursor-pointer">
                    Quantity
                  </th>
                  <th className="py-3 px-0 text-left cursor-pointer">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="text-gray-600 text-sm font-light">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-0 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="h-12 w-12 object-cover rounded-full"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Add other product details */}
                    <td className="py-3 px-0 text-left">{product.title}</td>
                    <td className="py-3 px-0 text-left">{product.category}</td>

                    <td className="py-3 px-0 text-left">${product.price}</td>
                    <td className="py-3 px-0 text-left">{product.sku}</td>
                    <td className="py-3 px-0 text-left">
                      {product.deleted && (
                        <span className="text-red-400">Product deleted</span>
                      )}
                      {product?.stock > 0 ? (
                        <span className="text-green-400">{product.stock}</span>
                      ) : (
                        <span className="text-red-400">{product.stock}</span>
                      )}
                    </td>
                    <td className="py-3 px-0 text-left">
                      <Link
                        to={
                          userInfo?.role === "admin"
                            ? "#"
                            : `/admin/product-form/edit/${product.id}`
                        }
                        className={`${
                          userInfo?.role === "admin"
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-indigo-600 hover:text-indigo-900"
                        }`}
                        onClick={(e) =>
                          userInfo?.role === "admin" && e.preventDefault()
                        }
                      >
                        Edit Product
                      </Link>

                      {/* <button disabled={userInfo?.role === "admin"}>
                          Edit Product
                        </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
