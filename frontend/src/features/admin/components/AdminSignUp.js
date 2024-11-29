import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Navigate, Link } from "react-router-dom";
import { createUserAsync, selectLoggedInUser } from "../../auth/authSlice";
import apiClient from "../../common/apiClient";
import toast from "react-hot-toast";
import { handleApiError } from "../../../utils";
import CommonButton from "../../common/CommonButton";

const Label = ({ htmlFor, children, required }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium leading-6 text-gray-900"
  >
    {children}
    {required && <span className="text-red-500"> *</span>}
  </label>
);

export default function AdminSignup() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const [isGstRegistered, setIsGstRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  //   if (user) {
  //     return <Navigate to="/login" replace={true} />;
  //   }

  return (
    <>
      <div
        className="min-h-screen flex items-start justify-center"
        // style={{ backgroundImage: "linear-gradient(115deg, #9F7AEA, #FEE2FE)" }}
      >
        <div className="w-full lg:w-1/2 py-8 px-4 md:py-16 md:px-12">
          <h2 className="text-3xl mb-4">Register</h2>
          <p className="mb-4">Create new account.</p>
          <form
            onSubmit={handleSubmit(async (data) => {
              // dispatch(
              //   createUserAsync({
              //     name: data.firstname + " " + data.surname,
              //     email: data.email,
              //     gst_number: isGstRegistered ? data.gstNumber : null,
              //     company_name: data.companyName,
              //     phone_number: data.phoneNumber,
              //     date_of_birth: data.DOB,
              //     gender: data.gender,
              //     password: data.password,
              //     addresses: [],
              //     role: data?.role,
              //     user_status: isGstRegistered ? "active" : "inactive",
              //     ownerInfo: { id: user.id, role: user?.role },
              //   })
              // );

              setLoading(true);
              const userData = {
                name: data.firstname + " " + data.surname,
                email: data.email,
                gst_number: isGstRegistered ? data.gstNumber : null,
                company_name: data.companyName,
                phone_number: data.phoneNumber,
                date_of_birth: data.DOB,
                gender: data.gender,
                password: data.password,
                addresses: [],
                role: data?.role,
                user_category: data.user_category,
                user_status: isGstRegistered ? "active" : "inactive",
                ownerInfo: { id: user.id, role: user?.role },
              };
              try {
                const response = await apiClient.post("/auth/signup", userData);
                if (response) {
                  toast.success("User cerated successfully.");
                  setLoading(false);
                }
              } catch (error) {
                handleApiError(error);
                setLoading(false);
              }
            })}
          >
            <div className="flex flex-wrap -mx-2 mb-2">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <Label htmlFor="firstname" required>
                  First Name
                </Label>
                <div className="">
                  <input
                    id="firstname"
                    {...register("firstname", {
                      required: "First Name is required",
                    })}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.firstname && (
                    <p className="text-red-500">{errors.firstname.message}</p>
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/2 px-2">
                <Label htmlFor="surname" required>
                  Surname
                </Label>
                <div className="">
                  <input
                    id="surname"
                    {...register("surname", {
                      required: "Surname is required",
                    })}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.surname && (
                    <p className="text-red-500">{errors.surname.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap -mx-2 mb-2">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <Label htmlFor="email" required>
                  Email address
                </Label>
                <div className="">
                  <input
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                        message: "Email not valid",
                      },
                    })}
                    type="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/2 px-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="">
                  <input
                    id="companyName"
                    {...register("companyName", {
                      required: false,
                    })}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.companyName && (
                    <p className="text-red-500">{errors.companyName.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap -mx-2 mb-2">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <Label htmlFor="phoneNumber" required>
                  Phone Number
                </Label>
                <div className="">
                  <input
                    id="phoneNumber"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone number not valid",
                      },
                    })}
                    type="tel"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500">{errors.phoneNumber.message}</p>
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/2 px-2">
                <div className="flex gap-4 items-center">
                  <Label htmlFor="isGstRegistered">GST Registered</Label>
                  <input
                    type="checkbox"
                    id="isGstRegistered"
                    checked={isGstRegistered}
                    onChange={(e) => setIsGstRegistered(e.target.checked)}
                    className="mt-1"
                  />
                </div>
              </div>
              {isGstRegistered && (
                <div className="w-full md:w-1/2 px-2 mt-4 md:mt-0">
                  <Label htmlFor="gstNumber" required={isGstRegistered}>
                    GST Number
                  </Label>
                  <div className="">
                    <input
                      id="gstNumber"
                      {...register("gstNumber", {
                        required: isGstRegistered
                          ? "GST number is required"
                          : false,
                      })}
                      type="text"
                      disabled={!isGstRegistered}
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        !isGstRegistered && "bg-gray-200"
                      }`}
                    />
                    {errors.gstNumber && (
                      <p className="text-red-500">{errors.gstNumber.message}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap -mx-2 mb-2">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <Label htmlFor="DOB" required>
                  Date of Birth
                </Label>
                <div className="">
                  <input
                    id="DOB"
                    {...register("DOB", {
                      required: "Date of birth is required",
                    })}
                    type="date"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.DOB && (
                    <p className="text-red-500">{errors.DOB.message}</p>
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/2 px-2">
                <Label htmlFor="gender" required>
                  Gender
                </Label>
                <div className="">
                  <select
                    id="gender"
                    {...register("gender", {
                      required: "Gender is required",
                    })}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500">{errors.gender.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap -mx-2 mb-2">
              <div className="w-full md:w-1/2 px-2">
                <Label htmlFor="role" required>
                  Role
                </Label>
                <div className="">
                  <select
                    id="role"
                    {...register("role", {
                      required: "Role is required",
                    })}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="user">User</option>
                  </select>
                  {errors?.role && (
                    <p className="text-red-500">{errors?.role.message}</p>
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/2 px-2">
                <Label htmlFor="role" required>
                  User Category
                </Label>
                <div className="">
                  <select
                    id="user_category"
                    {...register("user_category", {
                      required: "Role is required",
                    })}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="regular">Regular</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="platinum">Platinum</option>
                  </select>
                  {errors.user_category && (
                    <p className="text-red-500">{errors?.role.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-2">
              <Label htmlFor="password" required>
                Password
              </Label>
              <div className="">
                <input
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="mb-2">
              <Label htmlFor="confirmPassword" required>
                Confirm Password
              </Label>
              <div className="">
                <input
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  })}
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <CommonButton
                type="submit"
                loading={loading}
                disabled={loading}
                text={"Register"}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              ></CommonButton>
            </div>
          </form>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <Link
              to="/login"
              className="text-xs text-gray-500 uppercase hover:underline"
            >
              or sign in
            </Link>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>
        </div>
      </div>
    </>
  );
}
