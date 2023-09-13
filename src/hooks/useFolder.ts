import { useEffect, useReducer } from 'react';
import { useAuth } from '../context/AuthContext';
import { TDocData, database } from '../firebase/database';

enum ACTIONS {
	SELECT_FOLDER = 'select-folder',
	UPDATE_FOLDER = 'update-folder',
	SET_CHILD_FOLDERS = 'set-child-folders',
	SET_CHILD_FILES = 'set-child-files',
}

export type TPathElement = {
	name: string;
	id: string | null;
};

export type TFolder = {
	id: string | null;
	name: string;
	path: Array<TPathElement>;
};

export type TFile = TDocData & {
	id: string;
	url: string;
	folderId: string;
};

export type TUseFolderState = {
	folderId: string | null;
	folder: TFolder | null;
	childFolders: TFolder[];
	childFiles: TFile[];
};

export const ROOT_FOLDER: TFolder = { name: 'Root', id: null, path: [] };

function reducer(
	state: TUseFolderState,
	{
		type,
		payload,
	}: {
		type: ACTIONS;
		payload: Partial<TUseFolderState>;
	}
): TUseFolderState {
	switch (type) {
		case ACTIONS.SELECT_FOLDER:
			return {
				folderId: (payload as Required<TUseFolderState>).folderId,
				folder: (payload as Required<TUseFolderState>).folder,
				childFolders: [],
				childFiles: [],
			};
		case ACTIONS.UPDATE_FOLDER:
			return {
				...state,
				folder: (payload as Required<TUseFolderState>).folder,
			};
		case ACTIONS.SET_CHILD_FOLDERS:
			return {
				...state,
				childFolders: (payload as Required<TUseFolderState>).childFolders,
			};
		case ACTIONS.SET_CHILD_FILES:
			return {
				...state,
				childFiles: (payload as Required<TUseFolderState>).childFiles,
			};
		default:
			return state;
	}
}

export function useFolder(
	folderId: string | null = null,
	folder: TFolder | null = null
) {
	const { currentUser } = useAuth();

	const [state, dispatch] = useReducer(reducer, {
		folderId,
		folder,
		childFolders: [],
		childFiles: [],
	});

	useEffect(() => {
		dispatch({
			type: ACTIONS.SELECT_FOLDER,
			payload: {
				...state,
				folderId,
				folder,
			},
		});
	}, [folderId, folder]);

	useEffect(() => {
		if (folderId === null) {
			return dispatch({
				type: ACTIONS.UPDATE_FOLDER,
				payload: { ...state, folder: ROOT_FOLDER, folderId: null },
			});
		}

		database
			.getDoc('folders', folderId)
			.then((doc) => {
				dispatch({
					type: ACTIONS.UPDATE_FOLDER,
					payload: {
						...state,
						folder: database.formatDoc<TFolder>(doc),
						folderId: null,
					},
				});
			})
			.catch(() => {
				dispatch({
					type: ACTIONS.UPDATE_FOLDER,
					payload: { ...state, folder: ROOT_FOLDER, folderId: null },
				});
			});
	}, [folderId]);

	useEffect(() => {
		if (currentUser === null) return;

		const onSnapshot = (childFolders: TFolder[]) => {
			dispatch({
				type: ACTIONS.SET_CHILD_FOLDERS,
				payload: {
					...state,
					childFolders,
				},
			});
		};

		database.getChildFolders<TFolder>(folderId, currentUser.uid, onSnapshot);
	}, [folderId, currentUser]);

	useEffect(() => {
		if (currentUser === null) return;

		const onSnapshot = (files: TFile[]) => {
			dispatch({
				type: ACTIONS.SET_CHILD_FILES,
				payload: {
					...state,
					childFiles: files,
				},
			});
		};

		database.getChildFiles<TFile>(folderId, currentUser.uid, onSnapshot);
	}, [folderId, currentUser]);

	return state;
}
