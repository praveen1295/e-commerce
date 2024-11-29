import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectLoggedInUser } from "../authSlice";

// function Protected({ children }) {
//   const user = useSelector(selectLoggedInUser);

//   if (!user) {
//     return <Navigate to="/" replace={true}></Navigate>;
//   }
//   return children;
// }

// export default Protected;

import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ roles, children }) => {
  const auth = useAuth();

  if (auth.role && !roles.includes(auth.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
