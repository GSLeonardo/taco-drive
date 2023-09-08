import { useRef, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { SignupError } from '../firebase';

export default function Signup() {
	const { signup } = useAuth();

	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const passwordConfirmRef = useRef<HTMLInputElement>(null);

	const [signupError, setSignupError] = useState<string>('');
	const [waitingForSignup, setWaitingForSignup] = useState<boolean>(false);

	async function handleSubmit(event: any) {
		event.preventDefault();

		const email = emailRef.current?.value;
		const password = passwordRef.current?.value;
		const passwordConfirm = passwordConfirmRef.current?.value;

		if (
			email === undefined ||
			password === undefined ||
			passwordConfirm === undefined
		) {
			return setSignupError('Please complete the required fields');
		}

		if (password !== passwordConfirm) {
			return setSignupError("Passwords don't match");
		}

		try {
			setSignupError('');
			setWaitingForSignup(true);
			await signup(email, password);
		} catch (error: any) {
			const { message } = error as SignupError;
			setSignupError(message);
		}
		setWaitingForSignup(false);
	}

	return (
		<>
			<Card>
				<Card.Body>
					<h2 className='text-center mb-4'>Sign Up</h2>
					{signupError && <Alert variant='danger'>{signupError}</Alert>}
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
							<Form.Control type='password' ref={passwordConfirmRef} required />
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
				Already have an account? Login
			</div>
		</>
	);
}
