import { Link } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/footer/Footer.js";
import LandingHomePage from "../features/LandingHomePage/index.js";

function LandingPage() {
  return (
    <div>
      <NavBar>
        <LandingHomePage></LandingHomePage>
      </NavBar>
      <Footer></Footer>
    </div>
  );
}

export default LandingPage;
