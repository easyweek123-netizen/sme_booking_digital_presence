import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCredentials, logout as logoutAction } from '../store/slices/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
} from '../store/api/authApi';
import { ROUTES } from '../config/routes';
import type { LoginRequest, RegisterRequest } from '../types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
  
  // Only fetch user if we have a token but no user (e.g., after rehydration)
  const { refetch: refetchUser } = useGetMeQuery(undefined, {
    skip: !token || !!user,
  });

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await loginMutation(credentials).unwrap();
      dispatch(setCredentials({ user: result.user, token: result.token }));
      return result;
    },
    [loginMutation, dispatch]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      const result = await registerMutation(data).unwrap();
      dispatch(setCredentials({ user: result.user, token: result.token }));
      return result;
    },
    [registerMutation, dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
    navigate(ROUTES.HOME);
  }, [dispatch, navigate]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading: isLoggingIn || isRegistering,
    login,
    register,
    logout,
    refetchUser,
  };
}

