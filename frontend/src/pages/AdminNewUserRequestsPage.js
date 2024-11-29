import AdminNewUserRequests from "../features/admin/components/AdminNewUserRequests.js";
import AdminUsers from "../features/admin/components/AdminUsers.js";
import NavBar from "../features/navbar/Navbar";

function AdminNewUserRequestsPage() {
  return (
    <div>
      <NavBar>
        <AdminNewUserRequests></AdminNewUserRequests>
      </NavBar>
    </div>
  );
}

export default AdminNewUserRequestsPage;
