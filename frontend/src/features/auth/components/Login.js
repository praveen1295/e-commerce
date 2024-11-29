import { useSelector, useDispatch } from "react-redux";
import {
  selectAuthStatus,
  selectError,
  selectLoggedInUser,
} from "../authSlice";
import { Link, Navigate } from "react-router-dom";
import { loginUserAsync } from "../authSlice";
import { useForm } from "react-hook-form";
import CommonButton from "../../common/CommonButton";

export default function Login() {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const user = useSelector(selectLoggedInUser);
  const loading = useSelector(selectAuthStatus);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      {user && <Navigate to="/" replace={true} />}

      <div
        className="min-h-screen py-20 sm:py-24 md:py-32 lg:py-40"
        style={{ backgroundImage: "linear-gradient(115deg, #9F7AEA, #FEE2FE)" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row w-full lg:w-10/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
            <div
              className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 bg-no-repeat bg-cover bg-center"
              style={{
                backgroundImage: "url('assets/Register-Background.png')",
              }}
            >
              <h1 className="text-white text-2xl sm:text-3xl mb-3">Login</h1>
              <p className="text-white text-center">
                Welcome back! Login to access your account.
              </p>
            </div>
            <div className="w-full lg:w-1/2 py-8 px-6 sm:py-12 sm:px-10 md:py-16 md:px-12">
              <h2 className="text-2xl sm:text-3xl mb-4">Login</h2>
              <p className="mb-4">Enter your credentials to log in.</p>
              <form
                noValidate
                onSubmit={handleSubmit((data) => {
                  dispatch(
                    loginUserAsync({
                      email: data.email,
                      password: data.password,
                    })
                  );
                })}
                className="space-y-6"
              >
                <div className="mb-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
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

                <div className="mb-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="text-sm">
                      <Link
                        to="/forgot-password"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
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
                  {error && (
                    <p className="text-red-500">{error || error.message}</p>
                  )}
                </div>

                <div>
                  <CommonButton
                    type="submit"
                    className="rounded-full"
                    loading={loading === "loading"}
                    text={"Login"}
                  ></CommonButton>
                </div>
              </form>
              <p className="mt-10 text-center text-sm text-gray-500">
                Not a member?{" "}
                <Link
                  to="/signup"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
