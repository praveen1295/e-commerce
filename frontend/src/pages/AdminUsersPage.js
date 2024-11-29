import AdminUsers from "../features/admin/components/AdminUsers.js";
import NavBar from "../features/navbar/Navbar";

function AdminUsersPage() {
  return (
    <div>
      <NavBar>
        <AdminUsers></AdminUsers>
      </NavBar>
    </div>
  );
}

export default AdminUsersPage;
