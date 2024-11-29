import React from "react";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/footer/Footer";
import ShopProducts from "../features/ShopProducts";

const ShopProductsPage = () => {
  return (
    <div>
      <NavBar>
        <ShopProducts></ShopProducts>
      </NavBar>
      <Footer></Footer>
    </div>
  );
};

export default ShopProductsPage;
