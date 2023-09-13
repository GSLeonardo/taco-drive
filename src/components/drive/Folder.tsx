import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TFolder } from '../../hooks/useFolder';
import { ROUTES } from '../../router';

export default function Folder({ folder }: { folder: TFolder }) {
	return (
		<Button
			to={`${ROUTES.FOLDER}/${folder.id ? folder.id : ''}`}
			state={{
				folder: folder,
			}}
			variant='outline-dark'
			//@ts-ignore
			as={Link}
			className='text-truncate w-100'
		>
			<FontAwesomeIcon icon={faFolder} className='me-2' />
			{folder.name}
		</Button>
	);
}
