import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { TCurrentUser, auth, login, logout, signup } from '../firebase';

const AuthContext = createContext<{
	currentUser: TCurrentUser;
	signup: typeof signup;
	login: typeof login;
	logout: typeof logout;
}>({
	currentUser: null,
	signup,
	login,
	logout,
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
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
