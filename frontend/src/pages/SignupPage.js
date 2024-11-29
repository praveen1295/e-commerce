import Signup from "../features/auth/components/Signup";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/common/Footer";

function SignupPage() {
  return (
    <div>
      <NavBar>
        <Signup></Signup>
      </NavBar>
      {/* <Footer /> */}
    </div>
  );
}

export default SignupPage;
