import { AuthError } from 'firebase/auth';
import { useRef, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const [authError, setAuthError] = useState<string>('');
	const [waitingForLogin, setWaitingForLogin] = useState<boolean>(false);

	async function handleSubmit(event: any) {
		event.preventDefault();

		const email = emailRef.current?.value;
		const password = passwordRef.current?.value;

		if (email === undefined || password === undefined) {
			return setAuthError('Please complete the required fields');
		}

		try {
			setAuthError('');
			setWaitingForLogin(true);
			await login(email, password);
			navigate('/');
		} catch (error: any) {
			const { message } = error as AuthError;
			setAuthError(message);
		}
		setWaitingForLogin(false);
	}

	return (
		<>
			<Card>
				<Card.Body>
					<h2 className='text-center mb-4'>Log In</h2>
					{authError && <Alert variant='danger'>{authError}</Alert>}
					<Form onSubmit={handleSubmit}>
						<Form.Group id='email' className='mt-3'>
							<Form.Label>Email</Form.Label>
							<Form.Control type='email' ref={emailRef} required />
						</Form.Group>
						<Form.Group id='password' className='mt-3'>
							<Form.Label>Password</Form.Label>
							<Form.Control type='password' ref={passwordRef} required />
						</Form.Group>
						<Button
							type='submit'
							disabled={waitingForLogin}
							className='w-100 mt-3'
						>
							Log In
						</Button>
					</Form>
				</Card.Body>
			</Card>
			<div className='w-100 text-center mt-2'>
				Need an account? <Link to={'/signup'}>Sign Up</Link>
			</div>
		</>
	);
}
