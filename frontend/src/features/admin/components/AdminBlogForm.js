import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedBlog,
  createBlogAsync,
  fetchBlogByIdAsync,
  selectSelectedBlog,
  updateBlogAsync,
} from "../../Blogs/blogsSlice";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAlert } from "react-alert";

function AdminBlogForm() {
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
  const selectedBlog = useSelector(selectSelectedBlog);
  const alert = useAlert();

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [photosPreview, setPhotosPreview] = useState([]);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchBlogByIdAsync(params.id));
    } else {
      dispatch(clearSelectedBlog());
      reset();
    }
  }, [params.id, dispatch, reset]);

  useEffect(() => {
    if (selectedBlog && params.id) {
      setValue("id", params.id);
      setValue("title", selectedBlog.title);
      setValue("content", selectedBlog.content);
      setValue("author", selectedBlog.author);
      setValue("views", selectedBlog.views);
      setValue("category", selectedBlog.category);
      setValue("tags", selectedBlog.tags);
      setValue("published", selectedBlog.published);
      setValue("blogsThumbnail", selectedBlog.blogsThumbnail);
      setValue("blogsPhotos", selectedBlog.blogsPhotos);

      if (selectedBlog?.thumbnail) {
        setThumbnailPreview(selectedBlog.thumbnail);
      }

      if (selectedBlog.images && selectedBlog?.images?.length > 0) {
        setPhotosPreview(selectedBlog.images);
      }
    }
  }, [selectedBlog, params.id]);

  const onThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const onPhotosChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotosPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Conditional checks before appending each field
    if (data.title) {
      formData.append("title", data.title);
    }

    if (data.content) {
      formData.append("content", data.content);
    }

    if (data.author) {
      formData.append("author", data.author);
    }

    if (data.category) {
      formData.append("category", data.category);
    }

    if (data.tags) {
      formData.append("tags", data.tags);
    }

    formData.append("published", data.published ? "true" : "false");

    if (data?.blogsThumbnail?.length > 0) {
      formData.append("blogsThumbnail", data.blogsThumbnail[0]);
    }

    if (data?.blogsPhotos?.length > 0) {
      for (let i = 0; i < data.blogsPhotos.length; i++) {
        formData.append("blogsPhotos", data.blogsPhotos[i]);
      }
    }

    if (params.id) {
      formData.append("id", params.id);
      dispatch(updateBlogAsync({ id: params.id, formData }));
      alert.success("Blog Updated");
    } else {
      dispatch(createBlogAsync(formData));
      alert.success("Blog Created");
    }

    // navigate("/blogs");
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
              {params.id ? "Edit Blog" : "Add Blog"}
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Blog Title
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
                  htmlFor="content"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Content
                </label>
                <div className="mt-2">
                  <textarea
                    id="content"
                    {...register("content", {
                      required: "Content is required",
                    })}
                    rows={10}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.content && (
                    <span className="text-red-600">
                      {errors.content.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="author"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Author
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register("author", { required: "Author is required" })}
                    id="author"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errors.author && (
                    <span className="text-red-600">
                      {errors.author.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Category
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register("category")}
                    id="category"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tags
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register("tags")}
                    id="tags"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Comma separated tags"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="blogsThumbnail"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Thumbnail
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register("blogsThumbnail")}
                    id="blogsThumbnail"
                    className="block w-full text-gray-900"
                    onChange={onThumbnailChange}
                  />
                </div>
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Blog Thumbnail"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="blogsPhotos"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Images
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register("blogsPhotos")}
                    id="blogsPhotos"
                    className="block w-full text-gray-900"
                    multiple
                    onChange={onPhotosChange}
                  />
                </div>
                {photosPreview.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photosPreview.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Blog Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("published")}
                    id="published"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="published"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Published
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => navigate("/admin/blogs")}
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

export default AdminBlogForm;
