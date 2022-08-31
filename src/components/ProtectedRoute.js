import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './Context';

export const ProtectedRoute = () => {
  const { token } = useAuth();
  console.log('token', token)
  if(!token) {
    return <Navigate to='/login' replace></Navigate>
  }
  return <Outlet />
}