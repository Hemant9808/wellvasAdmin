import { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

export const useAuthMiddleware = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = checkIfUserIsLoggedIn();
    console.log("isloogedin",isLoggedIn)
    const publicRoutes = ["/login", "/signup"];
    const isBookingRoute = location.pathname.startsWith("/booking");
    const isProfileRoute =
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/dashboard");

    if (!isLoggedIn && (isProfileRoute || isBookingRoute)) {
      const useLocation = location.pathname;
      const useSearch = location.search;

      navigate("/signup", { replace: true });
    }
    if (!isLoggedIn ) {
       
        navigate("/login", { replace: true });
      }
  

    if (isLoggedIn &&  location.pathname.startsWith("/login")) {
      navigate("/", { replace: true });
    }
  }, [navigate, location]);
};

export const checkIfUserIsLoggedIn = () => {
  const token = localStorage.getItem("token")
    // ? JSON.parse(localStorage.getItem("auth-storage")).state.token
    // : null;
  return !!token;
};

export const clearLocalStorage = (navigate) => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("auth-storage");
  navigate("/login", { replace: true });
};
