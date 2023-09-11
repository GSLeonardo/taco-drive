import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import {
	TCurrentUser,
	auth,
	login,
	logout,
	resetPassword,
	signup,
} from '../firebase';

const AuthContext = createContext<{
	currentUser: TCurrentUser;
	signup: typeof signup;
	login: typeof login;
	logout: typeof logout;
	resetPassword: typeof resetPassword;
}>({
	currentUser: null,
	signup,
	login,
	logout,
	resetPassword,
});

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [currentUser, setCurrentUser] = useState<TCurrentUser>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const unsuscribe = auth.onAuthStateChanged(user => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsuscribe;
	}, []);

	const value = {
		currentUser,
		signup,
		login,
		logout,
		resetPassword,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
