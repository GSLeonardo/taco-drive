import { useEffect, useReducer } from 'react';
import { useAuth } from '../context/AuthContext';
import { database } from '../firebase/database';

enum ACTIONS {
	SELECT_FOLDER = 'select-folder',
	UPDATE_FOLDER = 'update-folder',
	SET_CHILD_FOLDERS = 'set-child-folders',
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

export type TFolderState = {
	folderId: string | null;
	folder: TFolder | null;
	childFolders: TFolder[];
	childFiles: any[];
};

export const ROOT_FOLDER: TFolder = { name: 'Root', id: null, path: [] };

function reducer(
	state: TFolderState,
	{
		type,
		payload,
	}: {
		type: ACTIONS;
		payload: Partial<TFolderState>;
	}
): TFolderState {
	switch (type) {
		case ACTIONS.SELECT_FOLDER:
			return {
				folderId: (payload as Required<TFolderState>).folderId,
				folder: (payload as Required<TFolderState>).folder,
				childFolders: [],
				childFiles: [],
			};
		case ACTIONS.UPDATE_FOLDER:
			return {
				...state,
				folder: (payload as Required<TFolderState>).folder,
			};
		case ACTIONS.SET_CHILD_FOLDERS:
			return {
				...state,
				childFolders: (payload as Required<TFolderState>).childFolders,
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

		database
			.getChildFolders<TFolder>(folderId, currentUser.uid)
			.then((childFolders) => {
				dispatch({
					type: ACTIONS.SET_CHILD_FOLDERS,
					payload: {
						...state,
						childFolders,
					},
				});
			});
	}, [folderId]);

	return state;
}
