import AdminOrderDetail from "../features/admin/components/AdminOrderDetail";
import Footer from "../features/footer/Footer";
import NavBar from "../features/navbar/Navbar";

function AdminOrdersDetailPage() {
  return (
    <div>
      <NavBar>
        {/* <h1 className="mx-auto text-2xl">Orders Detail</h1> */}
        <AdminOrderDetail></AdminOrderDetail>
      </NavBar>
      {/* <Footer></Footer> */}
    </div>
  );
}

export default AdminOrdersDetailPage;
