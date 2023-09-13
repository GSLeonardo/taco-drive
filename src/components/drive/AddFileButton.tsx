import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UploadTaskSnapshot } from 'firebase/storage';
import { useState } from 'react';
import { ProgressBar, Toast } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { v4 } from 'uuid';
import { useAuth } from '../../context/AuthContext';
import { TUploadFile, uploadFile } from '../../firebase/storage';
import { ROOT_FOLDER, TFolder } from '../../hooks/useFolder';

type TAddFileButton = {
	currentFolder: TFolder | null;
};

export default function AddFileButton({ currentFolder }: TAddFileButton) {
	const [uploadingFiles, setUploadingFiles] = useState<any[]>([]);
	const { currentUser } = useAuth();

	function handleUpload(event: any) {
		const id = v4();
		const file: File = event.target.files[0];

		if (currentUser === null || currentFolder === null || file === null) return;

		setUploadingFiles((prevUploadingFiles) => [
			...prevUploadingFiles,
			{
				id: id,
				name: file.name,
				progress: 0,
				error: false,
			},
		]);

		const stringPath = currentFolder.path
			.map((pathElement) => pathElement.name)
			.join('/');

		const filePath =
			currentFolder == ROOT_FOLDER
				? `${stringPath}/${file.name}`
				: `${stringPath}/${currentFolder.name}/${file.name}`;

		const onNext = (snapshot: UploadTaskSnapshot) => {
			const progress = snapshot.bytesTransferred / snapshot.totalBytes;
			setUploadingFiles((prevUploadingFiles) => {
				return prevUploadingFiles.map((uploadFile) => {
					if (uploadFile.id === id) {
						return { ...uploadFile, progress: progress };
					}

					return uploadFile;
				});
			});
		};

		const onError = () => {
			console.log('error');
			setUploadingFiles((prevUploadingFiles) => {
				return prevUploadingFiles.map((uploadFile) => {
					if (uploadFile.id === id) {
						return { ...uploadFile, error: true };
					}

					return uploadFile;
				});
			});
		};

		const onComplete = () => {
			setUploadingFiles((prevUploadingFiles) => {
				return prevUploadingFiles.filter((uploadFile) => {
					return uploadFile.id !== id;
				});
			});
		};

		const fileToUpload: TUploadFile = {
			id: id,
			userId: currentUser.uid,
			folderId: currentFolder.id,
			path: `${currentUser.uid}/${filePath}`,
			data: file,
		};

		uploadFile(fileToUpload, onNext, onError, onComplete);
	}
	return (
		<>
			<label className='btn btn-outline-success btn-sm m-0 me-2'>
				<FontAwesomeIcon icon={faFileUpload} />
				<input
					type='file'
					onChange={handleUpload}
					style={{ opacity: 0, position: 'absolute', left: '-200vw' }}
				></input>
			</label>
			{uploadingFiles.length > 0 &&
				ReactDOM.createPortal(
					<div
						style={{
							position: 'absolute',
							bottom: '1rem',
							right: '1rem',
							maxWidth: '250px',
						}}
					>
						{uploadingFiles.map((file) => {
							return (
								<Toast
									key={file.id}
									onClose={() => {
										setUploadingFiles((prevUploadingFiles) => {
											return prevUploadingFiles.filter((uploadFile) => {
												return uploadFile.id !== file.id;
											});
										});
									}}
								>
									<Toast.Header
										closeButton={!file.error}
										className='text-truncate w-100 d-block'
									>
										{file.name}
									</Toast.Header>
									<Toast.Body>
										<ProgressBar
											animated={!file.error}
											variant={file.error ? 'danger' : 'primary'}
											now={file.error ? 100 : file.progress * 100}
											label={
												file.error
													? 'Error'
													: `${Math.round(file.progress * 100)}%`
											}
										/>
									</Toast.Body>
								</Toast>
							);
						})}
					</div>,
					document.body
				)}
		</>
	);
}
