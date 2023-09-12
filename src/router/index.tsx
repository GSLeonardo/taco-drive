import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import ForgotPassword from '../components/authentication/ForgotPassword';
import Login from '../components/authentication/Login';
import Signup from '../components/authentication/Signup';
import UpdateProfile from '../components/authentication/UpdateProfile';
import PrivateLayout from '../layouts/PrivateLayout';
import RootLayout from '../layouts/RootLayout';

export enum ROUTES {
	ROOT = '/',
	LOGIN = '/login',
	SIGNUP = '/signup',
	FORGOT_PASSWORD = '/forgot-password',
	DASHBOARD = '/user',
	UPDATE_PROFILE = '/update-profile',
}

const router = createBrowserRouter([
	{
		path: ROUTES.ROOT,
		element: <RootLayout />,
		children: [
			{
				path: ROUTES.ROOT,
				element: <PrivateLayout />,
				children: [
					// Drive

					// Profile
					{
						path: ROUTES.DASHBOARD,
						element: <Dashboard />,
					},
					{
						path: ROUTES.UPDATE_PROFILE,
						element: <UpdateProfile />,
					},
				],
			},
			// Authentication
			{
				path: ROUTES.SIGNUP,
				element: <Signup />,
			},
			{
				path: ROUTES.LOGIN,
				element: <Login />,
			},
			{
				path: ROUTES.FORGOT_PASSWORD,
				element: <ForgotPassword />,
			},
		],
	},
]);

export default router;
