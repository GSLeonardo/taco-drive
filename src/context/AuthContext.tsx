import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { TCurrentUser, auth, createUser } from '../firebase';

function signup(email: string, password: string) {
	return createUser(email, password);
}

const AuthContext = createContext<{
	currentUser: TCurrentUser;
	signup: typeof signup;
}>({
	currentUser: null,
	signup,
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
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
