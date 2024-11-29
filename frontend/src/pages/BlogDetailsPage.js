import React from "react";
import BlogDetails from "../features/Blogs/BlogDetails";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/footer/Footer";

const BlogDetailsPage = () => {
  return (
    <div>
      <NavBar>
        <BlogDetails></BlogDetails>
      </NavBar>
      <Footer></Footer>
    </div>
  );
};

export default BlogDetailsPage;
