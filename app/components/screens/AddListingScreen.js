import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import AddListingPage from '../../src/AddListing.js';

export default function AddListingScreen() {
	return (
		<GluestackUIProvider>
			<Center>
				<AddListingPage />
			</Center>
		</GluestackUIProvider>
	);
}