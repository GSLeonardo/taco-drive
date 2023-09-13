import { Breadcrumb, BreadcrumbItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ROOT_FOLDER, TFolder, TPathElement } from '../../hooks/useFolder';
import { ROUTES } from '../../router';

type TFolderBreadcrumbs = {
	currentFolder: TFolder | null;
};

export default function FolderBreadcrumbs({
	currentFolder,
}: TFolderBreadcrumbs) {
	const ROOT_PATH_ELEMENT = ROOT_FOLDER as TPathElement;
	console.log(currentFolder, ROOT_PATH_ELEMENT);
	let path = currentFolder == ROOT_PATH_ELEMENT ? [] : [ROOT_PATH_ELEMENT];

	if (currentFolder !== null) {
		path = [...path, ...currentFolder.path];
	}
	return (
		<Breadcrumb
			className='flex-grow-1 '
			listProps={{ className: 'bg-white pl-0 m-0' }}
		>
			{path.map((pathElement, index) => (
				<BreadcrumbItem
					key={pathElement.id}
					linkAs={Link}
					linkProps={{
						to: pathElement.id
							? `${ROUTES.FOLDER}/${pathElement.id}`
							: `${ROUTES.ROOT}`,
						state: {
							folder: {
								...pathElement,
								path: path.slice(1, index),
							} as TFolder,
						},
					}}
					style={{ maxWidth: '150px' }}
					className='text-truncate d-inline-block'
				>
					{pathElement.name}
				</BreadcrumbItem>
			))}
			{currentFolder && (
				<BreadcrumbItem
					style={{ maxWidth: '200px' }}
					className='text-truncate d-inline-block'
					active
				>
					{currentFolder.name}
				</BreadcrumbItem>
			)}
		</Breadcrumb>
	);
}
