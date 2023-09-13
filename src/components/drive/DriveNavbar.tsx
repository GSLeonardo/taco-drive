import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router';

export default function DriveNavbar() {
	return (
		<Navbar bg='light' expand={true} className='p-3'>
			<Navbar.Brand as={Link} to={ROUTES.ROOT}>
				Taco Drive
			</Navbar.Brand>
			<Nav className='flex-grow-1 justify-content-end'>
				<Nav.Link as={Link} to={ROUTES.PROFILE}>
					Profile
				</Nav.Link>
			</Nav>
		</Navbar>
	);
}
