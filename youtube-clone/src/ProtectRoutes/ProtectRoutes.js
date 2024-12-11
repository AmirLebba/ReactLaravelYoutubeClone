import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth"; // Adjust path if utils is in another directory

const ProtectedRoutes = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
