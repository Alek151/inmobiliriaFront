// auth/index.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const useAuth = () => {
  const location = useLocation();

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    console.log(token)
    return !!token;
  };

  return {
    isLoggedIn,
    location,
  };
};

export default useAuth;
