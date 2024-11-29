import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo, updateUserAsync } from "../userSlice";
import { RxAvatar } from "react-icons/rx";
import { IoMdClose } from "react-icons/io"; // For closing the drawer

import { UserCircleIcon } from "@heroicons/react/24/outline";
import {
  selectOtpSent,
  selectOtpVerified,
  sendOtpAsync,
  verifyOtpAsync,
  resetOtp,
  resetOtpVerify,
} from "../../auth/authSlice";

const UserProfile = () => {
  const user = useSelector(selectUserInfo);
  const sentOtp = useSelector(selectOtpSent);
  const verifyOtp = useSelector(selectOtpVerified);

  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState({
    personalInfo: false,
    email: false,
    mobile: false,
    address: { flag: false, id: -1 },
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [userInfo, setUserInfo] = useState(user);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [editAddressForm, setEditAddressForm] = useState(false);
  const [updateUserInfo, setUpdateUserInfo] = useState({
    email: "",
    phone_number: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const updateUserData = (data) => {
    dispatch(updateUserAsync({ id: user.id, ...data }));
  };

  const handlePersonalInfoSubmit = (data) => {
    const newProfileInfo = {
      name: data.firstName + " " + data.lastName,
      gender: data.gender,
    };

    updateUserData(newProfileInfo);

    setIsEditing({ ...isEditing, personalInfo: false });
  };

  const handleEditClick = (type, id, data) => {
    switch (type) {
      case "personalInfo":
        setIsEditing({ ...isEditing, personalInfo: true });
        break;
      case "email":
        setIsEditing({ ...isEditing, email: true });

        break;
      case "mobile":
        setIsEditing({ ...isEditing, mobile: true });

        break;
      case "address":
        setIsEditing({ ...isEditing, address: { flag: true, id } });
        setEditAddressForm(true);
        setShowAddAddressForm(false);
        if (data) {
          for (const key in data) {
            setValue(key, data[key]);
          }
        }
        break;

      default:
        break;
    }
  };

  const handleAddAddress = (data) => {
    const updatedAddresses = [...userInfo.addresses, data];

    setUserInfo((prevState) => ({
      ...prevState,
      addresses: [...prevState.addresses, data],
    }));
    updateUserData({ addresses: updatedAddresses });
    setShowAddAddressForm(false);
  };

  const handleEmailSubmit = (data) => {
    if (data.otp) {
      const otpData = { userId: user.id, email: user.email, otp: data.otp };
      dispatch(verifyOtpAsync(otpData));
    } else if (data.email) {
      const sentOtpData = {
        userId: user.id,
        email: data.email,
        otpType: "profileUpdate",
      };

      dispatch(sendOtpAsync(sentOtpData));
      setUpdateUserInfo({ ...updateUserInfo, email: data.email });
    }
  };

  const handleMobileNumberSubmit = (data) => {
    if (data.otp) {
      const otpData = { userId: user.id, email: user.email, otp: data.otp };
      dispatch(verifyOtpAsync(otpData));
    } else if (data.mobileNumber) {
      const sentOtpData = {
        userId: user.id,
        email: data.email,
        otpType: "profileUpdate",
      };

      dispatch(sendOtpAsync(sentOtpData));
      setUpdateUserInfo({ ...updateUserInfo, phone_number: data.mobileNumber });
    }
  };

  useEffect(() => {
    if (verifyOtp) {
      if (isEditing.email) {
        updateUserData({ email: updateUserInfo.email });
        setIsEditing({ ...isEditing, email: false });
      } else if (isEditing.mobile) {
        updateUserData({ phone_number: updateUserInfo.phone_number });
        setIsEditing({ ...isEditing, mobile: false });
      }
      dispatch(resetOtp());
      dispatch(resetOtpVerify());
    }
  }, [verifyOtp]);

  useEffect(() => {
    if (user) {
      setValue("firstName", user?.name?.split(" ")[0]);
      setValue(
        "lastName",
        user?.name?.split(" ").length > 1 ? user?.name?.split(" ")[1] : ""
      );
      setValue("gender", user?.gender);
      setValue("email", user?.email);
      setValue("mobileNumber", user?.phoneNumber);
      setUserInfo(user);
    }
  }, [setValue, user]);

  const handleEditAddress = (data, index) => {
    const updatedAddresses = userInfo.addresses.map((address, i) =>
      i === index ? data : address
    );
    setUserInfo((prevState) => ({
      ...prevState,
      addresses: updatedAddresses,
    }));

    updateUserData({ addresses: updatedAddresses });

    setIsEditing({
      ...isEditing,
      address: { ...isEditing.address, id: -1, flag: false },
    });

    reset(userInfo);
    setShowAddAddressForm(false);
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = userInfo.addresses.filter((_, i) => i !== index);
    setUserInfo((prevState) => ({
      ...prevState,
      addresses: updatedAddresses,
    }));
    updateUserData({ addresses: updatedAddresses });
  };

  const renderEditAddressForm = (address, index) => {
    return (
      <form
        className="bg-white px-5 py-12 mt-12"
        noValidate
        onSubmit={handleSubmit((data) =>
          showAddAddressForm
            ? handleAddAddress(data)
            : handleEditAddress(data, index)
        )}
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              {address ? "Edit Your Address" : "Add New Address"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Fill in the form below to add a new address?.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Full name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="name"
                    defaultValue={address?.name || ""}
                    {...register("name", { required: true })}
                    className={`text-xl px-2 py-4 w-full`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">
                      This field is required
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="street"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Street
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="street"
                    defaultValue={address?.street || ""}
                    {...register("street", {
                      required: true,
                    })}
                    className={`text-xl px-2 py-4 w-full`}
                  />
                  {errors.street && (
                    <p className="mt-2 text-sm text-red-600">
                      This field is required
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  City
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="city"
                    defaultValue={address?.city || ""}
                    {...register("city", { required: true })}
                    className={`text-xl px-2 py-4 w-full`}
                  />
                  {errors.city && (
                    <p className="mt-2 text-sm text-red-600">
                      This field is required
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  State
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="state"
                    defaultValue={address?.state || ""}
                    {...register("state", { required: true })}
                    className={`text-xl px-2 py-4 w-full`}
                  />
                  {errors.state && (
                    <p className="mt-2 text-sm text-red-600">
                      This field is required
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="pinCode"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Pin Code
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="pinCode"
                    defaultValue={address?.pinCode || ""}
                    {...register("pinCode", {
                      required: true,
                    })}
                    className={`text-xl px-2 py-4 w-full`}
                  />
                  {errors.pinCode && (
                    <p className="mt-2 text-sm text-red-600">
                      This field is required
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="phone"
                    defaultValue={address?.phone || ""}
                    {...register("phone", { required: true })}
                    className={`text-xl px-2 py-4 w-full`}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600">
                      This field is required
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => {
              if (address) {
                setIsEditing((prev) => ({
                  ...prev,
                  address: { ...prev.address, id: -1 },
                }));
                setEditAddressForm(false);
              } else {
                setShowAddAddressForm(false);
              }
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    );
  };

  const renderOtpInput = (check) => {
    return (
      <>
        <div>
          <small className="text-red-500">
            Otp sent to your registered email address
          </small>
          <div></div>
          <input
            type="text"
            className={`bg-${
              !isEditing.otp ? "gray-100 text-gray-600" : "white"
            } text-xl px-2 py-4 w-full`}
            {...register("otp", { required: true })}
            placeholder="Enter 6 digits otp."
            // defaultValue={userInfo.otp}
            // disabled={!isEditing.otp}
          />
        </div>

        {errors.email && (
          <p className="mt-2 text-sm text-red-600">This field is required</p>
        )}
        <button
          type="submit"
          className="text-xl font-semibold text-blue-600 hover:underline hover:cursor-pointer mt-2"
        >
          {check && sentOtp && "submit"}
        </button>
      </>
    );
  };

  const renderSection = () => {
    if (!userInfo) return <div>Loading...</div>;

    switch (activeSection) {
      case "profile":
        return (
          <div className="bg-white p-6  shadow-lg">
            <div className="flex justify-between">
              <div className="flex gap-4 items-center mb-4 pb-2">
                <h3 className="text-2xl font-semibold">Personal Information</h3>
                {isEditing.personalInfo ? (
                  <h3
                    className="text-xl font-semibold text-blue-600 hover:underline hover:cursor-pointer"
                    onClick={() =>
                      setIsEditing({ ...isEditing, personalInfo: false })
                    }
                  >
                    Cancel
                  </h3>
                ) : (
                  <h3
                    className="text-xl font-semibold text-blue-600 hover:underline hover:cursor-pointer"
                    onClick={() => handleEditClick("personalInfo")}
                  >
                    Edit
                  </h3>
                )}
              </div>
              <h3 className={`text-2xl font-semibold `}>
                Status:{" "}
                <span
                  className={`text-${
                    user.status === "inactive" ? "red-500" : "green-500"
                  }`}
                >
                  {userInfo.status}
                </span>
              </h3>
            </div>
            <>
              <form
                noValidate
                onSubmit={handleSubmit(handlePersonalInfoSubmit)}
              >
                <div className="flex items-center flex-wrap gap-4 mb-4">
                  <div className="w-full md:w-1/3 pr-0 md:pr-2 mb-4 md:mb-0">
                    <label className="hidden text-gray-700">First Name</label>
                    <input
                      type="text"
                      className={`bg-${
                        !isEditing.personalInfo
                          ? "gray-100 text-gray-600"
                          : "white"
                      } text-xl px-2 py-4 w-full`}
                      {...register("firstName", { required: false })}
                      defaultValue={userInfo?.name?.split(" ")[0]}
                      disabled={!isEditing.personalInfo}
                    />
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-600">
                        This field is required
                      </p>
                    )}
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="hidden text-gray-700">Last Name</label>
                    <input
                      type="text"
                      className={`bg-${
                        !isEditing.personalInfo
                          ? "gray-100 text-gray-600"
                          : "white"
                      } text-xl px-2 py-4 w-full`}
                      {...register("lastName", { required: false })}
                      defaultValue={
                        user?.name?.split(" ").length > 1 &&
                        user?.name?.split(" ")[1]
                      }
                      disabled={!isEditing.personalInfo}
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-600">
                        This field is required
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="text-xl font-semibold text-blue-600 hover:underline hover:cursor-pointer"
                  >
                    {isEditing.personalInfo && "Save"}
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Your Gender</label>
                  <div
                    className={`flex text-xl mt-2 text-${
                      !isEditing.personalInfo ? "gray-600 text-gray-600" : ""
                    }`}
                  >
                    <label className="flex items-center mr-4">
                      <input
                        type="radio"
                        className="mr-2"
                        value="male"
                        {...register("gender")}
                        disabled={!isEditing.personalInfo}
                        defaultChecked={userInfo.gender === "male"}
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="mr-2"
                        value="female"
                        {...register("gender")}
                        disabled={!isEditing.personalInfo}
                        defaultChecked={userInfo.gender === "female"}
                      />
                      Female
                    </label>
                  </div>
                </div>
              </form>

              <form
                noValidate
                onSubmit={handleSubmit((data) => handleEmailSubmit(data))}
              >
                <div className="flex gap-4 items-center mb-4 pb-2">
                  <h3 className="text-2xl font-semibold">Email Addresses</h3>
                  {isEditing.email ? (
                    <h3
                      className="text-xl font-semibold text-blue-600 hover:underline hover:cursor-pointer"
                      onClick={() => {
                        setIsEditing({ ...isEditing, email: false });
                        dispatch(resetOtp());
                        setValue("otp", null);
                      }}
                    >
                      Cancel
                    </h3>
                  ) : (
                    <h3
                      className="text-xl font-semibold text-blue-600 hover:underline hover:cursor-pointer"
                      onClick={() => handleEditClick("email")}
                    >
                      Edit
                    </h3>
                  )}
                </div>
                <div className="mb-4">
                  <label className="hidden text-gray-700">Email Address</label>
                  <div className="flex gap-4 items-center">
                    {isEditing.email && sentOtp ? (
                      renderOtpInput(isEditing.email)
                    ) : (
                      <>
                        <input
                          type="email"
                          className={`bg-${
                            !isEditing.email
                              ? "gray-100 text-gray-600"
                              : "white"
                          } text-xl px-2 py-4 w-1/3`}
                          {...register("email", { required: false })}
                          defaultValue={userInfo.email}
                          disabled={!isEditing.email}
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">
                            This field is required
                          </p>
                        )}
                        <button
                          type="submit"
                          className="text-xl font-semibold text-blue-600 hover:underline hover:cursor-pointer"
                        >
                          {isEditing.email && !sentOtp && "Save"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>

              <form
                noValidate
                onSubmit={handleSubmit((data) =>
                  handleMobileNumberSubmit(data)
                )}
              >
                <div className="flex gap-4 items-center mb-4 pb-2">
                  <h3 className="text-2xl font-semibold">Mobile Number</h3>
                  {isEditing.mobile ? (
                    <h3
                      className="text-xl font-semibold text-blue-600 hover:underline hover:cursor-pointer"
                      onClick={() => {
                        setIsEditing({ ...isEditing, mobile: false });
                        dispatch(resetOtp());
                        setValue("otp", null);
                      }}
                    >
                      Cancel
                    </h3>
                  ) : (
                    <h3
                      className="text-xl font-semibold text-blue-600 hover:underline hover:cursor-pointer"
                      onClick={() => handleEditClick("mobile")}
                    >
                      Edit
                    </h3>
                  )}
                </div>
                <div>
                  <label className="hidden text-gray-700">Mobile Number</label>
                  <div className="flex gap-4 items-center">
                    {isEditing.mobile && sentOtp ? (
                      renderOtpInput(isEditing.mobile)
                    ) : (
                      <>
                        <input
                          type="tel"
                          className={`bg-${
                            !isEditing.mobile
                              ? "gray-100 text-gray-600"
                              : "white"
                          } text-xl px-2 py-4 w-1/3`}
                          {...register("mobileNumber", { required: false })}
                          defaultValue={userInfo.phoneNumber}
                          disabled={!isEditing.mobile}
                        />
                        {errors.mobileNumber && (
                          <p className="mt-2 text-sm text-red-600">
                            This field is required
                          </p>
                        )}
                        <button
                          type="submit"
                          className="text-xl font-semibold text-blue-600 hover:underline hover:cursor-pointer"
                        >
                          {isEditing.mobile && !sentOtp && "Save"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </>
          </div>
        );

      case "addresses":
        return (
          <div className="bg-white p-6  shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Manage Addresses</h2>

            <div className="mt-4">
              {showAddAddressForm ? (
                <div>{renderEditAddressForm()}</div>
              ) : (
                <button
                  className="flex items-center text-blue-600 hover:underline"
                  onClick={() => {
                    reset({
                      firstName: "",
                      lastName: "",
                      gender: "",
                      email: "",
                      mobileNumber: "",
                      street: "",
                      city: "",
                      state: "",
                      pinCode: "",
                      phone: "",
                    });
                    setShowAddAddressForm(true);
                    setIsEditing({
                      ...isEditing,
                      address: { ...isEditing.address, id: -1 },
                    });
                  }}
                >
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMyMTc1RkYiIGQ9Ik0xMS4yNSA2Ljc1aC00LjV2NC41aC0xLjV2LTQuNUguNzV2LTEuNWg0LjVWLjc1aDEuNXY0LjVoNC41Ii8+PHBhdGggZD0iTS0zLTNoMTh2MThILTMiLz48L2c+PC9zdmc+"
                    alt="Add"
                    className="w-4 h-4 mr-2"
                  />
                  ADD A NEW ADDRESS
                </button>
              )}
            </div>

            <div className="space-y-4">
              {userInfo?.addresses.map((address, index) => (
                <div key={index} className="border p-4 ">
                  {isEditing.address.id !== index ? (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-gray-700 font-semibold">
                          Address {index + 1}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() =>
                              handleEditClick("address", index, address)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => handleRemoveAddress(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-800">{address?.name}</p>
                      <p className="text-gray-600">{address?.phone}</p>
                      <p className="text-gray-600">
                        {address?.street}, {address?.city}, {address?.state} -{" "}
                        {address?.pinCode}
                      </p>
                    </>
                  ) : (
                    <>
                      {isEditing.address?.id === index &&
                        renderEditAddressForm(address, index)}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* {selectedEditIndex > -1 && (
              <form
                className="bg-white px-5 py-12 mt-12"
                noValidate
                onSubmit={handleSubmit((data) =>
                  handleEditAddress(data, selectedEditIndex)
                )}
              >
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                      Edit Address
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Fill in the form below to edit the address?.
                    </p>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Full name
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="name"
                            {...register("name", { required: true })}
                            defaultValue={
                              userInfo.addresses[selectedEditIndex].name
                            }
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.name && (
                            <p className="mt-2 text-sm text-red-600">
                              This field is required
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="street"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Street
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="street"
                            {...register("street", { required: true })}
                            defaultValue={
                              userInfo.addresses[selectedEditIndex].street
                            }
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.street && (
                            <p className="mt-2 text-sm text-red-600">
                              This field is required
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          City
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="city"
                            {...register("city", { required: true })}
                            defaultValue={
                              userInfo.addresses[selectedEditIndex].city
                            }
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.city && (
                            <p className="mt-2 text-sm text-red-600">
                              This field is required
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          State
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="state"
                            {...register("state", { required: true })}
                            defaultValue={
                              userInfo.addresses[selectedEditIndex].state
                            }
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.state && (
                            <p className="mt-2 text-sm text-red-600">
                              This field is required
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="pinCode"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Pin Code
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="pinCode"
                            {...register("pinCode", { required: true })}
                            defaultValue={
                              userInfo.addresses[selectedEditIndex].pinCode
                            }
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.pinCode && (
                            <p className="mt-2 text-sm text-red-600">
                              This field is required
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Phone Number
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            id="phone"
                            {...register("phone", { required: true })}
                            defaultValue={
                              userInfo.addresses[selectedEditIndex].phone
                            }
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.phone && (
                            <p className="mt-2 text-sm text-red-600">
                              This field is required
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                    onClick={() => setSelectedEditIndex(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            )} */}
          </div>
        );
      case "faq":
        return (
          <div className="bg-white p-6  shadow-lg">
            <h2 className="text-lg font-semibold mb-4">FAQs</h2>
            <div>
              <h4 className="font-semibold mb-2">
                What happens when I update my email address (or mobile number)?
              </h4>
              <p className="mb-4">
                Your login email id (or mobile number) changes, likewise. You'll
                receive all your account related communication on your updated
                email address (or mobile number).
              </p>
              <h4 className="font-semibold mb-2">
                When will my Flipkart account be updated with the new email
                address (or mobile number)?
              </h4>
              <p className="mb-4">
                It happens as soon as you confirm the verification code sent to
                your email (or mobile) and save the changes.
              </p>
              <h4 className="font-semibold mb-2">
                What happens to my existing Flipkart account when I update my
                email address (or mobile number)?
              </h4>
              <p className="mb-4">
                Updating your email address (or mobile number) doesn't
                invalidate your account. Your account remains fully functional.
                You'll continue seeing your Order history, saved information and
                personal details.
              </p>
              <h4 className="font-semibold mb-2">
                Does my Seller account get affected when I update my email
                address?
              </h4>
              <p>
                Flipkart has a 'single sign-on' policy. Any changes will reflect
                in your Seller account also.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen p-4 lg:p-8 bg-gray-100">
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 transition-transform transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
      >
        <div className="w-64 bg-white p-6 h-full overflow-y-auto relative">
          <button
            onClick={handleDrawerToggle}
            className="text-gray-600 hover:text-gray-800 absolute top-4 right-4"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
          <div className="flex items-center mb-4">
            {userInfo?.thumbnail ? (
              <img
                className="h-12 w-12 rounded-full"
                src={userInfo?.thumbnail}
                alt="Profile"
              />
            ) : (
              <RxAvatar className="h-16 w-16 mr-2 cursor-pointer rounded-full hover:text-gray-400" />
            )}
            <div className="ml-4">
              <div className="text-gray-600">Hello,</div>
              <div className="text-xl font-bold">{userInfo?.name}</div>
            </div>
          </div>
          <div className="bg-white shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Account Settings</h2>
            <div className="mb-2">
              <button
                className={`block w-full text-left text-blue-600 hover:underline ${
                  activeSection === "profile" && "font-bold"
                }`}
                onClick={() => {
                  setActiveSection("profile");
                  handleDrawerToggle();
                }}
              >
                Profile Information
              </button>
            </div>
            <div className="mb-2">
              <button
                className={`block w-full text-left text-blue-600 hover:underline ${
                  activeSection === "addresses" && "font-bold"
                }`}
                onClick={() => {
                  setActiveSection("addresses");
                  handleDrawerToggle();
                }}
              >
                Manage Addresses
              </button>
            </div>
            <div className="mb-2">
              <button
                className={`block w-full text-left text-blue-600 hover:underline ${
                  activeSection === "faq" && "font-bold"
                }`}
                onClick={() => {
                  setActiveSection("faq");
                  handleDrawerToggle();
                }}
              >
                FAQs
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`w-full lg:w-1/4 space-y-4 mb-4 lg:mb-0 hidden lg:block`}>
        <div className="bg-white shadow-lg p-6">
          <div className="flex items-center">
            {userInfo?.thumbnail ? (
              <img
                className="h-12 w-12 rounded-full"
                src={userInfo?.thumbnail}
                alt="Profile"
              />
            ) : (
              <RxAvatar className="h-16 w-16 mr-2 cursor-pointer rounded-full hover:text-gray-400" />
            )}
            <div className="ml-4">
              <div className="text-gray-600">Hello,</div>
              <div className="text-xl font-bold">{userInfo?.name}</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Account Settings</h2>
          <div className="mb-2">
            <button
              className={`block w-full text-left text-blue-600 hover:underline ${
                activeSection === "profile" && "font-bold"
              }`}
              onClick={() => setActiveSection("profile")}
            >
              Profile Information
            </button>
          </div>
          <div className="mb-2">
            <button
              className={`block w-full text-left text-blue-600 hover:underline ${
                activeSection === "addresses" && "font-bold"
              }`}
              onClick={() => setActiveSection("addresses")}
            >
              Manage Addresses
            </button>
          </div>
          <div className="mb-2">
            <button
              className={`block w-full text-left text-blue-600 hover:underline ${
                activeSection === "faq" && "font-bold"
              }`}
              onClick={() => setActiveSection("faq")}
            >
              FAQs
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-3/4 px-6 lg:px-8">
        <div className="lg:hidden">
          <button
            onClick={handleDrawerToggle}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <RxAvatar className="h-8 w-8" />
          </button>
        </div>
        {renderSection()}
      </div>
    </div>
  );
};

export default UserProfile;
