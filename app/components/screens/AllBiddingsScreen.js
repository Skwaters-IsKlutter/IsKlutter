import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import AllBiddingsPage from '../../src/AllBiddings';

export default function AllBiddingsScreen() {
	return (
		<GluestackUIProvider>
			<Center>
				<AllBiddingsPage />
			</Center>
		</GluestackUIProvider>
	);
}