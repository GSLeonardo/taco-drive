import { AuthError } from 'firebase/auth';
import { useRef, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
	const { resetPassword } = useAuth();
	const navigate = useNavigate();

	const emailRef = useRef<HTMLInputElement>(null);

	const [error, setError] = useState<string>('');
	const [message, setMessage] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	async function handleSubmit(event: any) {
		event.preventDefault();

		setMessage('');
		setError('');
		setLoading(true);

		const email = emailRef.current?.value;

		if (email === undefined) {
			return setError('Please complete the required fields');
		}

		try {
			await resetPassword(email);
			setMessage('Email sent successfully!');
		} catch (error: any) {
			const { message } = error as AuthError;
			setError(message);
		}
		setLoading(false);
	}

	return (
		<>
			<Card>
				<Card.Body>
					<h2 className='text-center mb-4'>Password Reset</h2>
					{error && <Alert variant='danger'>{error}</Alert>}
					{message && <Alert variant='success'>{message}</Alert>}
					<Form onSubmit={handleSubmit}>
						<Form.Group id='email' className='mt-3'>
							<Form.Label>Email</Form.Label>
							<Form.Control type='email' ref={emailRef} required />
						</Form.Group>
						<Button type='submit' disabled={loading} className='w-100 mt-3'>
							Reset Password
						</Button>
					</Form>
					<div className='w-100 text-center mt-3'>
						<Link to='/login'>Log In</Link>
					</div>
				</Card.Body>
			</Card>
			<div className='w-100 text-center mt-2'>
				Need an account? <Link to={'/signup'}>Sign Up</Link>
			</div>
		</>
	);
}
