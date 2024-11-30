import { Fragment, useState } from "react";
import "./navbar.scss";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  XMarkIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { ReactComponent as SearchIcon } from "../../assets/searchIcon.svg";

import { CiFacebook } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";

import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectItems } from "../cart/cartSlice";
import { selectUserInfo } from "../user/userSlice";
import SearchBar from "../searchbar/SearchBar";
import ShoppingCartModal from "../cart/CartModal";
import UpperHeader from "./UpperHeader";

const commonNavigation = [
  { name: "Home", link: "/home", user: true },
  { name: "Shop", link: "/shop", user: true },
  { name: "About Us", link: "/aboutus", user: true },
  { name: "Contact Us", link: "/contactus", user: true },
  { name: "Blogs", link: "/blogs", user: true },
];

const navigation = [
  { name: "Home", link: "/home", user: true, customerCare: true },
  {
    name: "Shop",
    link: "/shop",
    user: true,
    owner: true,
    admin: true,
    supervisor: true,
  },
  { name: "Blogs", link: "/blogs", user: true, customerCare: true },
  { name: "About Us", link: "/aboutus", user: true, customerCare: true },
  { name: "Contact Us", link: "/contactus", user: true, customerCare: true },
  {
    name: "Products",
    link: "/admin",
    owner: true,
    admin: true,
    supervisor: true,
  },
  {
    name: "Orders",
    link: "/admin/orders",
    owner: true,
    admin: true,
    supervisor: true,
  },
  {
    name: "Users",
    link: "/admin/users",
    owner: true,
    admin: true,
    supervisor: true,
  },

  {
    name: "New Customer requests",
    link: "/admin/newUserRequests",
    owner: true,
  },
  {
    name: "Blogs",
    link: "/admin/blogs",
    owner: true,
    admin: true,
    supervisor: true,
  },
  {
    name: "Banners",
    link: "/admin/banners",
    owner: true,
    admin: true,
    supervisor: true,
  },
  // { name: "Admin/User Register", link: "/admin/register", owner:true,  admin:true },
];

const userNavigation = [
  { name: "My Profile", link: "/profile" },
  { name: "My Orders", link: "/my-orders" },
  { name: "Sign out", link: "/logout" },
];

const beforLoginNavigation = [
  { name: "Sign In", link: "/login" },
  { name: "Sign Up", link: "/signup" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavBar({ children }) {
  const items = useSelector(selectItems);
  const userInfo = useSelector(selectUserInfo);
  const location = useLocation();
  const [isSearch, setIsSearch] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-full">
      <div className="fixed top-0 inset-x-0 z-50">
        <UpperHeader />
        <Disclosure
          as="nav"
          className="bg-white bg-opacity-65 shadow-md backdrop-blur-md"
        >
          {({ open }) => (
            <>
              <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Link to="/home">
                        <img
                          className="h-10 md:h-14"
                          src="/assets/logo.webp"
                          alt="Your Company"
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="hidden md:flex w-full justify-center items-baseline space-x-4">
                    {userInfo
                      ? navigation.map((item) =>
                          item[userInfo?.role] ? (
                            <Link
                              key={item.name}
                              to={item.link}
                              className={classNames(
                                item.link === location.pathname
                                  ? "text-blue-600"
                                  : "text-gray-900 hover:text-blue-600",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                            >
                              {item.name}
                            </Link>
                          ) : null
                        )
                      : commonNavigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.link}
                            className={classNames(
                              item.link === location.pathname
                                ? "text-blue-600"
                                : "text-gray-900 hover:text-blue-600",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                  </div>
                  <div className="hidden md:flex items-center ml-4">
                    <div className="mr-4 hidden md:flex relative">
                      {!isSearch ? (
                        <FaSearch
                          onClick={() => setIsSearch(true)}
                          className="cursor-pointer"
                        />
                      ) : (
                        <>
                          <IoClose
                            className="font-bold text-2xl cursor-pointer"
                            onClick={() => setIsSearch(false)}
                          />
                          <SearchBar
                            styles={{
                              position: "absolute",
                              width: "w-96",
                              top: "top-8",
                            }}
                            isSearch={isSearch}
                          />
                        </>
                      )}
                    </div>
                    {userInfo ? (
                      <>
                        <button
                          type="button"
                          onClick={handleOpenCart}
                          className="rounded-full p-1 text-xl hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <span className="sr-only">View notifications</span>
                          <ShoppingCartIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        </button>
                        <ShoppingCartModal
                          isOpen={isCartOpen}
                          onClose={handleCloseCart}
                        />
                        {items.length > 0 && (
                          <span className="inline-flex items-center rounded-md mb-7 -ml-3 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            {items.length}
                          </span>
                        )}
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white">
                              <span className="sr-only">Open user menu</span>
                              {userInfo?.imageUrl ? (
                                <img
                                  className="h-8 w-8 rounded-full"
                                  src={userInfo?.imageUrl}
                                  alt=""
                                />
                              ) : (
                                <RxAvatar className="h-10 w-10 mr-2 cursor-pointer rounded-full hover:text-gray-400" />
                              )}
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
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <Link
                                      to={item.link}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </>
                    ) : (
                      <div className="flex gap-4">
                        <Link
                          to="/login"
                          className="text-gray-900 hover:text-blue-600"
                        >
                          Login
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="mr-2 flex items-center md:hidden">
                    <div className="mr-2">
                      {/* {!isSearch ? (
                  <FaSearch
                    onClick={() => setIsSearch(true)}
                    className="cursor-pointer"
                  />
                ) : (
                  <>
                    <IoClose
                      className="font-bold text-2xl cursor-pointer"
                      onClick={() => setIsSearch(false)}
                    /> */}

                      <SearchBar />
                      {/* </>
                )} */}
                    </div>
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {userInfo
                    ? navigation.map((item) =>
                        item[userInfo?.role] ? (
                          <Disclosure.Button
                            key={item.name}
                            as={Link}
                            to={item.link}
                            className={classNames(
                              item.link === location.pathname
                                ? "text-blue-900"
                                : "text-gray-900 hover:text-blue-800",
                              "block rounded-md px-3 py-2 text-base font-medium"
                            )}
                          >
                            {item.name}
                          </Disclosure.Button>
                        ) : null
                      )
                    : commonNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as={Link}
                          to={item.link}
                          className={classNames(
                            item.link === location.pathname
                              ? "text-blue-900"
                              : "text-gray-900 hover:text-blue-800",
                            "block rounded-md px-3 py-2 text-base font-medium"
                          )}
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                </div>
                {userInfo ? (
                  <div className="border-t border-gray-700 pb-3 pt-4">
                    <div className="flex items-center justify-between px-5">
                      <div className="flex gap-2">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={userInfo?.imageUrl}
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-base font-medium leading-none text-white">
                            {userInfo?.name}
                          </div>
                          <div className="text-sm font-medium leading-none text-gray-400">
                            {userInfo?.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Link to="/cart">
                          <button
                            type="button"
                            className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                          >
                            <ShoppingCartIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          </button>
                        </Link>
                        {items.length > 0 && (
                          <span className="inline-flex items-center rounded-md bg-red-50 mb-7 -ml-3 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            {items.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as={Link}
                          to={item.link}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="px-2">
                    <Link
                      to="/login"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
      {/* <header className="bg-white shadow">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Ecommerce
      </h1>
    </div>
  </header> */}
      <main className="pt-20">
        {" "}
        {/* Add padding-top to compensate for fixed navbar */}
        <div className="mx-auto py-6">{children}</div>
      </main>
    </div>
  );
}

export default NavBar;
