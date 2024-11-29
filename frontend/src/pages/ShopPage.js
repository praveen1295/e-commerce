import { Link } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/footer/Footer.js";
import Shop from "../features/Shop/index.js";

function ShopPage() {
  return (
    <div>
      <NavBar>
        <Shop></Shop>
      </NavBar>
      <Footer></Footer>
    </div>
  );
}

export default ShopPage;
