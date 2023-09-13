import { createBrowserRouter } from 'react-router-dom';
import ForgotPassword from '../components/authentication/ForgotPassword';
import Login from '../components/authentication/Login.tsx';
import Profile from '../components/authentication/Profile';
import Signup from '../components/authentication/Signup';
import UpdateProfile from '../components/authentication/UpdateProfile';
import Dashboard from '../components/drive/Dashboard';
import PrivateLayout from '../layouts/PrivateLayout';
import RootLayout from '../layouts/RootLayout';

export enum ROUTES {
	ROOT = '/',
	LOGIN = '/login',
	SIGNUP = '/signup',
	FORGOT_PASSWORD = '/forgot-password',
	PROFILE = '/user',
	UPDATE_PROFILE = '/update-profile',
	FOLDER = '/folder',
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
					{
						path: ROUTES.ROOT,
						element: <Dashboard />,
					},
					{
						path: `${ROUTES.FOLDER}/:folderId`,
						element: <Dashboard />,
					},
					// Profile
					{
						path: ROUTES.PROFILE,
						element: <Profile />,
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
