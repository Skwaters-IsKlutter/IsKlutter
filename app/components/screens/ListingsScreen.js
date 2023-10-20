import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import ListingsPage from '../../../src/Listings.js';

export default function ListingsScreen() {
	return (
		<GluestackUIProvider>
			<Center>
				<ListingsPage />
			</Center>
		</GluestackUIProvider>
	);
}