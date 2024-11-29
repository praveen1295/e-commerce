import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const truncateText = (text, wordLimit) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

const ShowBlogs = ({ blogs, heading }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleReadMore = (id) => {
    navigate(`/blog/${id}`); // Redirect to the blog detail page with the blog id
  };

  return (
    <div className="container mx-auto px-2 py-2 h-48 overflow-auto">
      <h2 className="text-xl md:text-xl font-bold mb-4 text-center md:text-left">
        {heading}
      </h2>

      {blogs &&
        blogs.map((blog) => (
          <div
            className="mb-2 p-2 bg-white shadow-md border border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-start sm:p-2"
            key={blog.id}
          >
            <div className="sm:flex-1">
              <Link
                tp=""
                onClick={() => handleReadMore(blog.id)}
                className="text-xl md:text-xl font-semibold text-blue-600 hover:underline"
              >
                {blog?.title}
              </Link>
              <p className="mt-2 text-sm md:text-sm text-gray-500">
                {truncateText(blog?.content, 16)}
                <span
                  className="text-blue-600 hover:underline cursor-pointer ml-1"
                  onClick={() => handleReadMore(blog.id)}
                >
                  Read more
                </span>
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ShowBlogs;
