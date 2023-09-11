import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import ForgotPassword from '../components/ForgotPassword';
import Login from '../components/Login';
import Signup from '../components/Signup';
import UpdateProfile from '../components/UpdateProfile';
import PrivateLayout from '../layouts/PrivateLayout';
import RootLayout from '../layouts/RootLayout';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				path: '/',
				element: <PrivateLayout />,
				children: [
					{
						index: true,
						element: <Dashboard />,
					},
					{
						path: 'update-profile',
						element: <UpdateProfile />,
					},
				],
			},
			{
				path: 'signup',
				element: <Signup />,
			},
			{
				path: 'login',
				element: <Login />,
			},
			{
				path: 'forgot-password',
				element: <ForgotPassword />,
			},
		],
	},
]);

export default router;
