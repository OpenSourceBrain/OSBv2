import React from "react";
import { Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/rootReducer";
import { userLogin } from "../../store/actions/user";

export const ProtectedRoute = ({ children }) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  
  if(!user) {
    dispatch(userLogin());
    return <></>
  }
 return children;
}
    
