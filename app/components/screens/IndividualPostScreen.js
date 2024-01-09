import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import IndividualPostPage from '../../src/IndividualPost.js';

export default function IndividualPostScreen() {
	return (
		<GluestackUIProvider>
			<Center>
				<IndividualPostPage />
			</Center>
		</GluestackUIProvider>
	);
}