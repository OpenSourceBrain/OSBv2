import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedRoute = ({ ...rest }) => {
  return (
    <Route
      {...rest}
      render={
        rest.user
          ? <>{rest.children}</>
          : rest.login !== undefined ? rest.login() : null
        }
    />
  )
}
