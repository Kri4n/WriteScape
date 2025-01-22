import React from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { useContext, useEffect } from "react";

const Logout = () => {
  const { setUser, unsetUser } = useContext(UserContext);

  useEffect(() => {
    unsetUser();
    setUser({
      id: null,
    });
  }, []);

  return <Navigate to="/login" />;
};

export default Logout;
