"use client";
import { setAuthToken } from '@/lib/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      dispatch(setAuthToken(token));
    }
  }, [dispatch]);
};

export default useAuth;
