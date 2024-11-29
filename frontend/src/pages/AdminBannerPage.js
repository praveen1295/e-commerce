import NavBar from "../features/navbar/Navbar";
import AdminBlogs from "../features/admin/components/AdminBlogs";
import AdminBanners from "../features/admin/components/AdminBanners";

function AdminBannerPage() {
  return (
    <div>
      <NavBar>
        <AdminBanners></AdminBanners>
      </NavBar>
    </div>
  );
}

export default AdminBannerPage;
