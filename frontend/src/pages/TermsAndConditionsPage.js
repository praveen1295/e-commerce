import { Link } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/footer/Footer.js";
import TermsConditions from "../features/TermsAndConditions/index.js";

function LandingPage() {
  return (
    <div>
      <NavBar>
        <TermsConditions></TermsConditions>
      </NavBar>
      <Footer></Footer>
    </div>
  );
}

export default LandingPage;
