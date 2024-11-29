import Login from "../features/auth/components/Login";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/footer/Footer.js";

function LoginPage() {
  return (
    <div>
      <NavBar>
        <Login></Login>
      </NavBar>
      {/* <Footer /> */}
    </div>
  );
}

export default LoginPage;
