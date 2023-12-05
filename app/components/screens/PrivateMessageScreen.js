import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-uithemed';

import PrivateMessagePage from '../../src/PrivateMessage';

export default function PrivateMessageScreen() {
	return (
		<GluestackUIProvider>
			<Center>
				<PrivateMessagePage />		
			</Center>
		</GluestackUIProvider>
	);
}