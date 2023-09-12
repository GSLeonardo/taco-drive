import { PropsWithChildren } from 'react';
import { Container } from 'react-bootstrap';

export default function CenteredContainer(props: PropsWithChildren) {
	const { children } = props;
	return (
		<Container
			className='d-flex align-items-center justify-content-center'
			style={{ minHeight: '100vh' }}
		>
			<div className='w-100' style={{ maxWidth: '400px' }}>
				{children}
			</div>
		</Container>
	);
}
