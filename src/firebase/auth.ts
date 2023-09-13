import {
	User,
	createUserWithEmailAndPassword,
	getAuth,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	updateEmail as updateEmailFirebase,
	updatePassword as updatePasswordFirebase,
} from 'firebase/auth';
import app from './config';

const auth = getAuth(app);

export type TCurrentUser = typeof auth.currentUser;

export function signup(email: string, password: string) {
	return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email: string, password: string) {
	return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
	return signOut(auth);
}

export function resetPassword(email: string) {
	return sendPasswordResetEmail(auth, email);
}

export function updateEmail(user: User, email: string) {
	return updateEmailFirebase(user, email);
}

export function updatePassword(user: User, password: string) {
	return updatePasswordFirebase(user, password);
}

export default auth;
