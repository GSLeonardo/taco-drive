import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import auth, {
	TCurrentUser,
	login,
	logout,
	resetPassword,
	signup,
	updateEmail,
	updatePassword,
} from '../firebase/auth';

const defaultContext = {
	currentUser: null,
	signup,
	login,
	logout,
	resetPassword,
	updateEmail,
	updatePassword,
};

const AuthContext = createContext<{
	currentUser: TCurrentUser;
	signup: typeof signup;
	login: typeof login;
	logout: typeof logout;
	resetPassword: typeof resetPassword;
	updateEmail: typeof updateEmail;
	updatePassword: typeof updatePassword;
}>(defaultContext);

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [currentUser, setCurrentUser] = useState<TCurrentUser>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsuscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsuscribe;
	}, []);

	const value = {
		...defaultContext,
		currentUser,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
