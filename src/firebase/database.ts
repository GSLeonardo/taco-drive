import 'firebase/firestore';
import {
	DocumentData,
	DocumentSnapshot,
	FieldValue,
	addDoc,
	collection,
	doc,
	getDoc as getDocFirebase,
	getDocs,
	getFirestore,
	orderBy,
	query,
	serverTimestamp,
	where,
} from 'firebase/firestore';
import app from './config';

const firestore = getFirestore(app);

export type TCollectionCategory = 'folders' | 'files';

export type TDocData = DocumentData & {
	name: string;
	// parentId: string;
	userId: string;
	// path: string;
	createdAt: FieldValue;
};

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

async function getChildFolders<T>(
	parentId: string | null,
	userId: string
): Promise<Array<T>> {
	const searchQuery = query(
		database.folders,
		where('parentId', '==', parentId),
		where('userId', '==', userId),
		orderBy('createdAt')
	);

	const searchQuerySnapshot = await getDocs(searchQuery);
	return searchQuerySnapshot.docs.map((doc) => formatDoc(doc) as T);
}

export const database = {
	folders: collection(firestore, 'folders'),
	files: collection(firestore, 'files'),
	getCurrentTimestamp: serverTimestamp,
	getDoc: getDoc,
	addToCollection,
	formatDoc,
	getChildFolders,
};
