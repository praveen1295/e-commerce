import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Navigate, Link } from "react-router-dom";
import {
  selectLoggedInUser,
  createUserAsync,
  selectAuthStatus,
} from "../authSlice";
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

export default function Signup() {
  const loading = useSelector(selectAuthStatus);

  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const [isGstRegistered, setIsGstRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  if (user) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <>
      <div
        className="min-h-screen py-16 md:py-24 lg:py-40"
        style={{ backgroundImage: "linear-gradient(115deg, #9F7AEA, #FEE2FE)" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row w-full md:w-10/12 lg:w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
            <div
              className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 bg-no-repeat bg-cover bg-center"
              style={{
                backgroundImage: "url('assets/Register-Background.png')",
              }}
            >
              <h1 className="text-white text-3xl mb-3">Welcome</h1>
              <div>
                <p className="text-white text-center">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aenean suspendisse aliquam varius rutrum purus maecenas ac{" "}
                  <a href="#" className="text-purple-500 font-semibold">
                    Learn more
                  </a>
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 py-8 px-4 md:py-16 md:px-12">
              <h2 className="text-3xl mb-4">Register</h2>
              <p className="mb-4">Create your account.</p>
              <form
                onSubmit={handleSubmit((data) => {
                  dispatch(
                    createUserAsync({
                      name: data.firstname + " " + data.surname,
                      email: data.email,
                      gst_number: isGstRegistered ? data.gstNumber : null,
                      company_name: data.companyName,
                      phone_number: data.phoneNumber,
                      date_of_birth: data.DOB,
                      gender: data.gender,
                      password: data.password,
                      addresses: [],
                      role: "user",
                      user_status: isGstRegistered ? "active" : "inactive",
                    })
                  );
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
                        <p className="text-red-500">
                          {errors.firstname.message}
                        </p>
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
                    <Label htmlFor="companyName" required>
                      Company Name
                    </Label>
                    <div className="">
                      <input
                        id="companyName"
                        {...register("companyName", {
                          required: "Company name is required",
                        })}
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {errors.companyName && (
                        <p className="text-red-500">
                          {errors.companyName.message}
                        </p>
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
                        <p className="text-red-500">
                          {errors.phoneNumber.message}
                        </p>
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
                          <p className="text-red-500">
                            {errors.gstNumber.message}
                          </p>
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
                  {/* <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                  >
                    Register
                  </button> */}

                  <CommonButton
                    type="submit"
                    className="rounded-full"
                    loading={loading === "loading"}
                    text={"Register"}
                  ></CommonButton>
                </div>
              </form>
              <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-1/5 lg:w-1/4"></span>
                <Link
                  to="/login"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  or sign in
                </Link>
                <span className="border-b w-1/5 lg:w-1/4"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
