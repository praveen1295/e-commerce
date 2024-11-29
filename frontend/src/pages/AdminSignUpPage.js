import AdminSignup from "../features/admin/components/AdminSignUp.js";
import Footer from "../features/footer/Footer.js";
import NavBar from "../features/navbar/Navbar";

function AdminSignUpPage() {
  return (
    <div>
      <NavBar>
        <AdminSignup />
      </NavBar>
      <Footer></Footer>
    </div>
  );
}

export default AdminSignUpPage;
