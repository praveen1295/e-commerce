import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordRequestAsync, selectMailSent } from "../authSlice";

export default function ForgotPassword() {
  const mailSent = useSelector(selectMailSent);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center py-10 md:py-20 lg:py-40"
        style={{ backgroundImage: "linear-gradient(115deg, #9F7AEA, #FEE2FE)" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row w-full md:w-10/12 lg:w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
            <div
              className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 bg-no-repeat bg-cover bg-center"
              style={{
                backgroundImage: "url('assets/Register-Background.png')",
              }}
            >
              <h1 className="text-white text-2xl md:text-3xl mb-3">
                Forget Your Password
              </h1>
              <div>
                <p className="text-white text-center">
                  Enter email to reset password.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 py-10 px-6 md:py-16 md:px-12">
              <h2 className="text-2xl md:text-3xl mb-4">
                Forget Your Password
              </h2>
              <p className="mb-4">Enter email to reset password.</p>
              <form
                noValidate
                onSubmit={handleSubmit((data) => {
                  dispatch(resetPasswordRequestAsync(data.email));
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
                  <div className="mt-2">
                    <input
                      id="email"
                      {...register("email", {
                        required: "email is required",
                        pattern: {
                          value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                          message: "email not valid",
                        },
                      })}
                      type="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                    )}
                    {mailSent && <p className="text-green-500">Mail Sent</p>}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-purple-500 py-3 text-center text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  >
                    Send Email
                  </button>
                </div>
              </form>
              <p className="mt-10 text-center text-sm text-gray-500">
                Send me back to{" "}
                <Link
                  to="/login"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
