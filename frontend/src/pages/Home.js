import { Link, useLocation } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";
import Footer from "../features/footer/Footer.js";

function Home() {
  const location = useLocation();
  const products = location.state ? location.state.products : [];
  return (
    <div>
      <NavBar>
        <ProductList products={products}></ProductList>
      </NavBar>
      <Footer></Footer>
    </div>
  );
}

export default Home;
