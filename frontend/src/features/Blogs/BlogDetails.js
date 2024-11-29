import React, { useEffect } from "react";
import { useParams } from "react-router-dom"; // To get blog ID from URL
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogByIdAsync,
  selectSelectedBlog,
  selectBlogListStatus,
  selectBlogError,
} from "./blogsSlice";
import Loader from "../common/Loader";

const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blog = useSelector(selectSelectedBlog);
  const status = useSelector(selectBlogListStatus);
  const error = useSelector(selectBlogError);

  useEffect(() => {
    dispatch(fetchBlogByIdAsync(id));
  }, [dispatch, id]);

  if (status === "loading") {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!blog) {
    return <div>No blog found</div>;
  }

  const { title, content, author, views, category, tags, thumbnail, images } =
    blog;

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {thumbnail && (
          <img
            src={thumbnail}
            alt="Blog Thumbnail"
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <div className="text-gray-700 mb-4">
            <p className="text-sm">
              By <span className="font-semibold">{author}</span>
            </p>
            <p className="text-sm">
              Category:{" "}
              <span className="font-semibold">
                {category || "Uncategorized"}
              </span>
            </p>
            <p className="text-sm">
              Views: <span className="font-semibold">{views}</span>
            </p>
            {tags.length > 0 && (
              <div className="mt-2">
                <p className="text-sm">Tags:</p>
                <ul className="flex flex-wrap gap-2 mt-1">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="text-gray-800 mb-4">
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
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
      </div>
    </div>
  );
};

export default BlogDetails;
