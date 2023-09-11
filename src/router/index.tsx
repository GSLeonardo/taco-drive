import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import Signup from '../components/Signup';
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
		],
	},
]);

export default router;
