import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from '../redux/slices/authSlice';

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return children;
};

export default AppInitializer;
