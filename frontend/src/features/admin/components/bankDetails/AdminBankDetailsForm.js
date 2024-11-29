// AdminBankDetailForm.js
import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedBankDetail,
  createBankDetailsAsync,
  fetchBankDetailByIdAsync,
  selectSelectedBankDetail,
  updateBankDetailAsync,
} from "../../../bankDetails/bankDetailsSlice";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAlert } from "react-alert";
import { selectLoggedInUser } from "../../../auth/authSlice";

function AdminBankDetailForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const userInfo = useSelector(selectLoggedInUser);

  const selectedBankDetail = useSelector(selectSelectedBankDetail);
  console.log("paaaaaa", selectedBankDetail);

  const alert = useAlert();

  useEffect(() => {
    if (params.id) {
      dispatch(fetchBankDetailByIdAsync(params.id));
    } else {
      dispatch(clearSelectedBankDetail());
      reset();
    }
  }, [params.id, dispatch, reset]);

  useEffect(() => {
    if (selectedBankDetail && params.id) {
      setValue("id", params.id);
      setValue("bankName", selectedBankDetail.bankName);
      setValue("accountNumber", selectedBankDetail.accountNumber);
      setValue("ifscCode", selectedBankDetail.ifscCode);
      setValue("accountHolderName", selectedBankDetail.accountHolderName);
    }
  }, [selectedBankDetail, params.id, setValue]);

  const onSubmit = async (data) => {
    if (params.id) {
      dispatch(updateBankDetailAsync({ id: params.id, data }));
      alert.success("Bank Detail Updated");
    } else {
      dispatch(createBankDetailsAsync({ createdBy: userInfo.id, ...data }));
      alert.success("Bank Detail Created");
    }

    // navigate("/admin/bank-details");
  };

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12 bg-white p-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {params.id ? "Edit Bank Detail" : "Create New Bank Detail"}
            </h2>
            <div className="mt-4 flex flex-col gap-y-4">
              <div>
                <label
                  htmlFor="bankName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Bank Name
                </label>
                <input
                  id="bankName"
                  type="text"
                  {...register("bankName", {
                    required: "Bank Name is required",
                  })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
                />
                {errors.bankName && (
                  <p className="text-red-500 text-sm">
                    {errors.bankName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Account Number
                </label>
                <input
                  id="accountNumber"
                  type="text"
                  {...register("accountNumber", {
                    required: "Account Number is required",
                  })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.accountNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="ifscCode"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  IFSC Code
                </label>
                <input
                  id="ifscCode"
                  type="text"
                  {...register("ifscCode", {
                    required: "IFSC Code is required",
                  })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
                />
                {errors.ifscCode && (
                  <p className="text-red-500 text-sm">
                    {errors.ifscCode.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="accountHolderName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Account Holder Name
                </label>
                <input
                  id="accountHolderName"
                  type="text"
                  {...register("accountHolderName", {
                    required: "Account holder name Code is required",
                  })}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-600 focus:ring-indigo-600"
                />
                {errors.accountHolderName && (
                  <p className="text-red-500 text-sm">
                    {errors.accountHolderName.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-x-6">
                <button
                  type="button"
                  onClick={() => navigate("/admin/bank-details")}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default AdminBankDetailForm;
