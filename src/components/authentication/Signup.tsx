import { AuthError } from 'firebase/auth';
import { useRef, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CenteredContainer from '../../layouts/CenteredContainer';
import { ROUTES } from '../../router';

export default function Signup() {
	const { signup } = useAuth();
	const navigate = useNavigate();

	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const passwordConfirmRef = useRef<HTMLInputElement>(null);

	const [authError, setAuthError] = useState<string>('');
	const [waitingForSignup, setWaitingForSignup] = useState<boolean>(false);

	async function handleSubmit(event: any) {
		event.preventDefault();

		setAuthError('');
		setWaitingForSignup(true);

		const email = emailRef.current?.value;
		const password = passwordRef.current?.value;
		const passwordConfirm = passwordConfirmRef.current?.value;

		if (
			email === undefined ||
			password === undefined ||
			passwordConfirm === undefined
		) {
			return setAuthError('Please complete the required fields');
		}

		if (password !== passwordConfirm) {
			return setAuthError("Passwords don't match");
		}

		try {
			await signup(email, password);
			navigate(ROUTES.ROOT);
		} catch (error: any) {
			const { message } = error as AuthError;
			setAuthError(message);
		}
		setWaitingForSignup(false);
	}

	return (
		<CenteredContainer>
			<>
				<Card>
					<Card.Body>
						<h2 className='text-center mb-4'>Sign Up</h2>
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
							<Form.Group id='password-confirm' className='mt-3'>
								<Form.Label>Password Confirmation</Form.Label>
								<Form.Control
									type='password'
									ref={passwordConfirmRef}
									required
								/>
							</Form.Group>
							<Button
								type='submit'
								disabled={waitingForSignup}
								className='w-100 mt-3'
							>
								Submit
							</Button>
						</Form>
					</Card.Body>
				</Card>
				<div className='w-100 text-center mt-2'>
					Already have an account? <Link to={ROUTES.LOGIN}>Log In</Link>
				</div>
			</>
		</CenteredContainer>
	);
}
