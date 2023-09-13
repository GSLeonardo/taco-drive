import 'firebase/firestore';
import {
	DocumentData,
	DocumentSnapshot,
	FieldValue,
	QueryDocumentSnapshot,
	Unsubscribe,
	addDoc,
	collection,
	doc,
	getDoc as getDocFirebase,
	getDocs,
	getFirestore,
	onSnapshot as onSnapshotFirebase,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from 'firebase/firestore';
import app from './config';

export type TCollectionCategory = 'folders' | 'files';

export type TDocData = DocumentData & {
	name: string;
	userId: string;
	createdAt: FieldValue;
};

const firestore = getFirestore(app);

function addToCollection(category: TCollectionCategory, data: TDocData) {
	return addDoc(collection(firestore, category), data);
}

function getDoc(category: TCollectionCategory, docId: string) {
	const docRef = doc(firestore, category, docId);
	return getDocFirebase(docRef);
}

function formatDoc<T>(doc: DocumentSnapshot): T {
	return {
		id: doc.id,
		...doc.data(),
	} as T;
}

async function getDuplicateFiles(
	name: string,
	folderId: string,
	userId: string
): Promise<Array<QueryDocumentSnapshot>> {
	const searchQuery = query(
		database.files,
		where('name', '==', name),
		where('folderId', '==', folderId),
		where('userId', '==', userId)
	);

	const searchQuerySnapshot = await getDocs(searchQuery);

	return searchQuerySnapshot.docs;
}

function getChildFolders<T>(
	parentId: string | null,
	userId: string,
	onSnapshot: (childFolders: Array<T>) => void
): Unsubscribe {
	const searchQuery = query(
		database.folders,
		where('parentId', '==', parentId),
		where('userId', '==', userId),
		orderBy('createdAt')
	);

	return onSnapshotFirebase(searchQuery, (searchQuerySnapshot) => {
		onSnapshot(searchQuerySnapshot.docs.map((doc) => formatDoc(doc) as T));
	});
}

function getChildFiles<T>(
	folderId: string | null,
	userId: string,
	onSnapshot: (files: Array<T>) => void
): Unsubscribe {
	const searchQuery = query(
		database.files,
		where('folderId', '==', folderId),
		where('userId', '==', userId),
		orderBy('createdAt')
	);

	return onSnapshotFirebase(searchQuery, (searchQuerySnapshot) => {
		onSnapshot(searchQuerySnapshot.docs.map((doc) => formatDoc(doc) as T));
	});
}

export const database = {
	folders: collection(firestore, 'folders'),
	files: collection(firestore, 'files'),
	getCurrentTimestamp: serverTimestamp,
	getDoc: getDoc,
	addToCollection,
	formatDoc,
	getChildFolders,
	getChildFiles,
	getDuplicateFiles,
	update: updateDoc,
};
