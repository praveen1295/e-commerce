import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedBanner,
  createBannerAsync,
  fetchBannerByIdAsync,
  selectSelectedBanner,
  updateBannerAsync,
} from "../../Banners/bannersSlice";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAlert } from "react-alert";

function AdminBannerForm() {
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
  const selectedBanner = useSelector(selectSelectedBanner);
  const alert = useAlert();

  useEffect(() => {
    if (params.id) {
      dispatch(fetchBannerByIdAsync(params.id));
    } else {
      dispatch(clearSelectedBanner());
      reset();
    }
  }, [params.id, dispatch, reset]);

  useEffect(() => {
    if (selectedBanner && params.id) {
      setValue("id", params.id);
      setValue("title", selectedBanner.title);
      setValue("description", selectedBanner.description);
      setValue("image", selectedBanner.image);
      setValue("status", selectedBanner.status);
    }
  }, [selectedBanner, params.id, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("status", data.status || "inactive");

    if (data.image.length > 0) {
      formData.append("bannerImg", data.image[0]);
    }

    if (params.id) {
      formData.append("id", params.id);
      dispatch(updateBannerAsync(formData));
      alert.success("Banner Updated");
    } else {
      const results = await dispatch(createBannerAsync(formData));

      if (results?.payload.success) alert.success("Banner Created");
    }

    navigate("/admin/banners");
  };

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <div className="space-y-12 bg-white p-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {params.id ? "Edit Banner" : "Add Banner"}
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Banner Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register("title", { required: "Title is required" })}
                    id="title"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.title && (
                    <span className="text-red-600">{errors.title.message}</span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                    rows={10}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.description && (
                    <span className="text-red-600">
                      {errors.description.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Status
                </label>
                <div className="mt-2">
                  <select
                    id="status"
                    {...register("status", { required: "Status is required" })}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="deleted">Deleted</option>
                  </select>
                  {errors.status && (
                    <span className="text-red-600">
                      {errors.status.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register("image")}
                    id="image"
                    className="block w-full text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => navigate("/banners")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {params.id ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default AdminBannerForm;
