import React from "react";
import Blogs from "../features/Blogs";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/footer/Footer";

const BlogDetailsPage = () => {
  return (
    <div>
      <NavBar>
        <Blogs></Blogs>
      </NavBar>
      <Footer></Footer>
    </div>
  );
};

export default BlogDetailsPage;
