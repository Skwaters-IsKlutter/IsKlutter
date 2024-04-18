import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import AddBiddingPage from '../../src/AddBidding.js';

export default function AddBiddingScreen() {
	return (
		<GluestackUIProvider>
			<Center>
				<AddBiddingPage />
			</Center>
		</GluestackUIProvider>
	);
}