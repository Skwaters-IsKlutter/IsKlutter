import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import AllListingsPage from '../../src/AllListings.js';

export default function AllListingsScreen() {
	return (
		<GluestackUIProvider>
			<Center>
				<AllListingsPage />
			</Center>
		</GluestackUIProvider>
	);
}