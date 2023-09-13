import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { TDocData, database } from '../../firebase/database';
import { ROOT_FOLDER, TFolder, TPathElement } from '../../hooks/useFolder';

type TAddFolderButton = {
	currentFolder: TFolder | null;
};

export default function AddFolderButton({ currentFolder }: TAddFolderButton) {
	const { currentUser } = useAuth();

	const [open, setOpen] = useState<boolean>(false);
	const [name, setName] = useState<string>('');

	function openModal() {
		setOpen(true);
	}

	function closeModal() {
		setOpen(false);
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		if (currentFolder === null || currentUser === null) {
			return;
		}

		const path: Array<TPathElement> = [...currentFolder.path];

		if (currentFolder !== ROOT_FOLDER) {
			path.push({ name: currentFolder.name, id: currentFolder.id });
		}

		const folder: TDocData = {
			name: name,
			parentId: currentFolder.id,
			userId: currentUser.uid,
			path: path,
			createdAt: database.getCurrentTimestamp(),
		};

		// Create a folder in the database
		database.addToCollection('folders', folder);

		setName('');
		closeModal();
	}

	return (
		<>
			<Button onClick={openModal} variant='outline-success' size='sm'>
				<FontAwesomeIcon icon={faFolderPlus} />
			</Button>
			<Modal show={open} onHide={closeModal}>
				<Form onSubmit={handleSubmit}>
					<Modal.Body>
						<Form.Group>
							<Form.Label>Folder Name</Form.Label>
							<Form.Control
								type='text'
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
							></Form.Control>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={closeModal}>
							Close
						</Button>
						<Button variant='success' type='submit'>
							Add Folder
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
}
