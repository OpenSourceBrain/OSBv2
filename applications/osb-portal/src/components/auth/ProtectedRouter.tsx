import React from "react";
import { Route } from "react-router-dom";

export const ProtectedRoute = ({ children, user, login}) => {
  if(!user) {
    login();
    return <></>
  }
 return children;
}
    
