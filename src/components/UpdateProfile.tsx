import { AuthError } from 'firebase/auth';
import { useRef, useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UpdateProfile() {
	const { currentUser, updateEmail, updatePassword } = useAuth();
	const navigate = useNavigate();

	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const passwordConfirmRef = useRef<HTMLInputElement>(null);

	const [authError, setAuthError] = useState<string>('');
	const [waitingForProfileUpdate, setWaitingForProfileUpdate] =
		useState<boolean>(false);

	function handleSubmit(event: any) {
		event.preventDefault();

		setAuthError('');
		setWaitingForProfileUpdate(true);

		const email = emailRef.current?.value;
		const password = passwordRef.current?.value;
		const passwordConfirm = passwordConfirmRef.current?.value;

		if (email === undefined) {
			return setAuthError('Please complete the required fields');
		}

		if (password !== passwordConfirm) {
			return setAuthError("Passwords don't match");
		}

		if (currentUser === null) {
			return;
		} else if (currentUser.email === null || currentUser.email === undefined) {
			return;
		}

		const promises: Array<Promise<any>> = [];

		if (email !== currentUser.email) {
			promises.push(updateEmail(currentUser, email));
		}

		if (password) {
			promises.push(updatePassword(currentUser, password));
		}

		Promise.all(promises)
			.then(() => {
				navigate('/');
			})
			.catch((error: AuthError) => {
				const { message } = error;
				setAuthError(message);
			})
			.finally(() => {
				setWaitingForProfileUpdate(false);
			});
	}

	return (
		<>
			<Card>
				<Card.Body>
					<h2 className='text-center mb-4'>Update Profile</h2>
					{authError && <Alert variant='danger'>{authError}</Alert>}
					<Form onSubmit={handleSubmit}>
						<Form.Group id='email' className='mt-3'>
							<Form.Label>Email</Form.Label>
							<Form.Control
								type='email'
								ref={emailRef}
								required
								defaultValue={currentUser!.email!}
							/>
						</Form.Group>
						<Form.Group id='password' className='mt-3'>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type='password'
								ref={passwordRef}
								placeholder='Leave blank to keep password'
							/>
						</Form.Group>
						<Form.Group id='password-confirm' className='mt-3'>
							<Form.Label>Password Confirmation</Form.Label>
							<Form.Control
								type='password'
								ref={passwordConfirmRef}
								placeholder='Leave blank to keep password'
							/>
						</Form.Group>
						<Button
							type='submit'
							disabled={waitingForProfileUpdate}
							className='w-100 mt-3'
						>
							Update
						</Button>
					</Form>
				</Card.Body>
			</Card>
			<div className='w-100 text-center mt-2'>
				<Link to={'/'}>Cancel</Link>
			</div>
		</>
	);
}
