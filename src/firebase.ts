import { initializeApp } from 'firebase/app';
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

const app = initializeApp({
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

export const auth = getAuth(app);

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

export default app;
