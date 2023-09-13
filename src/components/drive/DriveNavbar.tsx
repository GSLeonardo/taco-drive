import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router';

export default function DriveNavbar() {
	return (
		<Navbar bg='light' expand={'sm'} className='p-3'>
			<Navbar.Brand as={Link} to={ROUTES.ROOT}>
				Taco Drive
			</Navbar.Brand>
			<Nav>
				<Nav.Link as={Link} to={ROUTES.PROFILE}>
					Profile
				</Nav.Link>
			</Nav>
		</Navbar>
	);
}
