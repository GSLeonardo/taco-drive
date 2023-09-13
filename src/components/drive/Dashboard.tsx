import { Container } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';
import { TFolder, useFolder } from '../../hooks/useFolder';
import AddFolderButton from './AddFolderButton';
import Navbar from './DriveNavbar';
import Folder from './Folder';
import FolderBreadcrumbs from './FolderBreadcrumbs';

export default function Dashboard() {
	const { folderId } = useParams();
	const { state }: { state: { folder: TFolder | null } } = useLocation();
	const { folder, childFolders } = useFolder(folderId, state?.folder);

	return (
		<>
			<Navbar />
			<Container fluid>
				{/* Folders navigation */}
				<div className='d-flex align-items-center my-3'>
					<FolderBreadcrumbs currentFolder={folder} />
					<AddFolderButton currentFolder={folder} />
				</div>
				{/* Content */}
				{childFolders.length > 0 && (
					<div className='d-flex flex-wrap'>
						{childFolders.map((childFolder) => (
							<div
								key={childFolder.id}
								style={{ maxWidth: '250px' }}
								className='p-2'
							>
								<Folder folder={childFolder} />
							</div>
						))}
					</div>
				)}
			</Container>
		</>
	);
}
