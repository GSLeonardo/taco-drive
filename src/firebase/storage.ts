import 'firebase/storage';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { TFile } from '../hooks/useFolder';
import app from './config';
import { database } from './database';

export type TUploadFile = Omit<TFile, 'createdAt' & 'name'> & { data: File };

const storage = getStorage(app);

const handleGetDownloadURL = async (url: string, file: TUploadFile) => {
	const duplicatedFiles = await database.getDuplicateFiles(
		file.data.name,
		file.folderId,
		file.userId
	);

	if (duplicatedFiles.length > 0) {
		database.update(duplicatedFiles[0].ref, { url: url });
	} else {
		database.addToCollection('files', {
			id: file.id,
			folderId: file.folderId,
			userId: file.userId,
			name: file.data.name,
			url: url,
			createdAt: database.getCurrentTimestamp(),
		} as TFile);
	}
};

export async function uploadFile(
	file: TUploadFile,
	onNext: any,
	onError: any,
	onComplete: any
) {
	const uploadTask = uploadBytesResumable(
		ref(storage, `/files/${file.path}`),
		await file.data.arrayBuffer()
	);

	uploadTask.on('state_changed', onNext, onError, async () => {
		onComplete();

		getDownloadURL(uploadTask.snapshot.ref).then((url) =>
			handleGetDownloadURL(url, file)
		);
	});
}

export default storage;
