import { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

export const useAuthMiddleware = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = checkIfUserIsLoggedIn();
    console.log("isloogedin",isLoggedIn)
  

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
  const authStorage = localStorage.getItem("authStorage");
  console.log("authStorage", authStorage,token)
  if ( !authStorage) {
    return false;
  }
  else {
   
      return true;
    
  }

  // // const token = localStorage.getItem("authToken")
    // ? JSON.parse(localStorage.getItem("auth-storage")).state.token
    // : null;
  
};

export const clearLocalStorage = (navigate) => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("auth-storage");
  navigate("/login", { replace: true });
};
