import AdminOrderDetail from "../features/admin/components/AdminOrderDetail";
import AdminUserDetails from "../features/admin/components/AdminUserDetails";
import Footer from "../features/footer/Footer";
import NavBar from "../features/navbar/Navbar";

function AdminUserDetailsPage() {
  return (
    <div>
      <NavBar>
        {/* <h1 className="mx-auto text-2xl">Orders Detail</h1> */}
        <AdminUserDetails></AdminUserDetails>
      </NavBar>
      {/* <Footer></Footer> */}
    </div>
  );
}

export default AdminUserDetailsPage;
