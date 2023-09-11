import { Container } from 'react-bootstrap';

import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import router from '../router';

function App() {
	return (
		<Container
			className='d-flex align-items-center justify-content-center'
			style={{ minHeight: '100vh' }}
		>
			<div className='w-100' style={{ maxWidth: '400px' }}>
				<AuthProvider>
					<RouterProvider router={router} />
				</AuthProvider>
			</div>
		</Container>
	);
}

export default App;
