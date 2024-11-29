import AdminList from "../features/admin/components/AdminList.js";
import NavBar from "../features/navbar/Navbar";

function AdminListPage() {
  return (
    <div>
      <NavBar>
        <AdminList></AdminList>
      </NavBar>
    </div>
  );
}

export default AdminListPage;
