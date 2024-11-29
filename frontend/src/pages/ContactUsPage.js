import { Link, useLocation } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/footer/Footer.js";
import ContactUs from "../features/ContactUs/index.js";

function ContactUsPage() {
  const location = useLocation();
  const products = location.state ? location.state.products : [];
  return (
    <div>
      <NavBar>
        <ContactUs products={products}></ContactUs>
      </NavBar>
      <Footer></Footer>
    </div>
  );
}

export default ContactUsPage;
