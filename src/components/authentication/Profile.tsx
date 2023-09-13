import { AuthError } from 'firebase/auth';
import { useState } from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
	const { currentUser, logout } = useAuth();
	const navigate = useNavigate();

	const [authError, setAuthError] = useState<string>('');

	async function handleLogout() {
		setAuthError('');

		try {
			await logout();
			navigate('/login');
		} catch (error) {
			const { message } = error as AuthError;
			setAuthError(message);
		}
	}

	return (
		<>
			<Card>
				<Card.Body>
					<h2 className='text-center mb-4'>Profile</h2>
					{authError && <Alert variant='danger'>{authError}</Alert>}
					<strong>Email: </strong>
					{currentUser!.email}
					<Link to={'/update-profile'} className='btn btn-primary w-100 mt-3'>
						Update Profile
					</Link>
				</Card.Body>
			</Card>
			<div className='w-100 text-center mt-2'>
				<Button variant='link' onClick={handleLogout}>
					Log Out
				</Button>
			</div>
		</>
	);
}
