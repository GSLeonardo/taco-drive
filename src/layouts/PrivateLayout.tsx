import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateLayout = () => {
	const { currentUser } = useAuth();
	return <>{currentUser ? <Outlet /> : <Navigate to={'/login'} />}</>;
};

export default PrivateLayout;
