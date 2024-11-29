import { Link } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/footer/Footer.js";
import PrivacyPolicy from "../features/PrivacyPolicy/index.js";

function LandingPage() {
  return (
    <div>
      <NavBar>
        <PrivacyPolicy></PrivacyPolicy>
      </NavBar>
      <Footer></Footer>
    </div>
  );
}

export default LandingPage;
