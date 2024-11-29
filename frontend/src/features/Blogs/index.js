import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBlogsAsync,
  selectBlogListStatus,
  selectBlogs,
} from "./blogsSlice";
import { ITEMS_PER_PAGE } from "../../app/constants";
import Loader from "../common/Loader";
import { Link } from "react-router-dom";

const Index = () => {
  const blogs = useSelector(selectBlogs);
  const loadingStatus = useSelector(selectBlogListStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    const pagination = { _page: 1, _limit: ITEMS_PER_PAGE };

    dispatch(fetchAllBlogsAsync({ sort: {}, filters: {}, pagination }));
  }, [dispatch]);

  if (loadingStatus === "loading") {
    return <Loader />;
  }

  return (
    <section className="py-12 container mx-auto px-6">
      <div className="flex justify-center">
        <div className="lg:w-2/3 space-y-5 text-center">
          <h1 className="text-2xl text-gray-800 uppercase tracking-widest">
            Blog
          </h1>
          <div className="h-0.5 bg-green-500 w-14 mx-auto"></div>
          <p className="text-gray-400">
            Our blog section serves as a platform for sharing our knowledge,
            experiences, and ideas with our readers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
        {blogs.map((blog, idx) => {
          return (
            <div key={blog.id}>
              <div className="transition-all ease-in-out duration-300 hover:-translate-y-4">
                <img
                  //   src="https://res.cloudinary.com/daiyj7fxl/image/upload/v1685001401/components/airfocus-lTWC_5OjyYc-unsplash_1_cxaswx_e25jxz.webp"
                  src={blog.thumbnail}
                  className="mb-4 h-56 w-full"
                  alt="Blog img-1"
                />
                <h1 className="text-gray-400 text-sm">{blog.category}</h1>
                <h1 className="mb-2">
                  <a href="#" className="text-xl hover:text-green-500">
                    {blog.title}
                  </a>
                </h1>
                <p className="text-gray-400 text-sm">{blog.content}</p>
                <div className="mt-4">
                  <Link to={`/blog/${blog.id}`} className="text-green-500">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* <div>
          <div className="transition-all ease-in-out duration-300 hover:-translate-y-4">
            <img
              src="https://res.cloudinary.com/daiyj7fxl/image/upload/v1685001401/components/bg-home_oxiq4q_ynkmm5.webp"
              className="mb-4"
              alt="Blog img-2"
            />
            <h1 className="text-gray-400 text-sm">Education</h1>
            <h1 className="mb-2">
              <a href="#" className="text-xl hover:text-green-500">
                Online Learning: Pros and Cons of the New Normal in Education
              </a>
            </h1>
            <p className="text-gray-400 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="mt-4">
              <a href="#" className="text-green-500">
                Read More
              </a>
            </div>
          </div>
        </div>

        <div>
          <div className="transition-all ease-in-out duration-300 hover:-translate-y-4">
            <img
              src="https://res.cloudinary.com/daiyj7fxl/image/upload/v1685001401/components/airfocus-lTWC_5OjyYc-unsplash_1_cxaswx_e25jxz.webp"
              className="mb-4"
              alt="Blog img-3"
            />
            <h1 className="text-gray-400 text-sm">Business</h1>
            <h1 className="mb-2">
              <a href="#" className="text-xl hover:text-green-500">
                Creating a Successful Startup: Tips from Industry Experts
              </a>
            </h1>
            <p className="text-gray-400 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="mt-4">
              <a href="#" className="text-green-500">
                Read More
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Index;
