import Footer from "../features/footer/Footer";
import NavBar from "../features/navbar/Navbar";
import UserOrderDetail from "../features/user/components/UserOrderDetail";

function UserOrdersDetailPage() {
  return (
    <div>
      <NavBar>
        {/* <h1 className="mx-auto text-2xl">Orders Detail</h1> */}
        <UserOrderDetail></UserOrderDetail>
      </NavBar>
      <Footer></Footer>
    </div>
  );
}

export default UserOrdersDetailPage;
