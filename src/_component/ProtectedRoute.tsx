import React from 'react';
import { useSelector } from 'react-redux';
import { setAuthToken } from '../lib/authSlice';
import SigninPage from '@/app/login/page';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useSelector(setAuthToken);

  if (!token) {
    return <SigninPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
