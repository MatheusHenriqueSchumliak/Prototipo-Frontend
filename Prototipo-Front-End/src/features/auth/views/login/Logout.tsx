import { useAuth } from "../../features/auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/Login");
  }, [logout, navigate]);

  return null;
};

export default Logout;
