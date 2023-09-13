import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TFile } from '../../hooks/useFolder';

type Props = {
	file: TFile;
};

export default function DriveFile({ file }: Props) {
	return (
		<a
			href={file.url}
			target='_blank'
			className='btn btn-outline-dark text-trunctate w-100'
		>
			<FontAwesomeIcon icon={faFile} className='me-2' />
			{file.name}
		</a>
	);
}
