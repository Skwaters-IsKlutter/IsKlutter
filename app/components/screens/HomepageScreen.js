import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import HomepagePage from '../../src/Homepage.js';

export default function HomepageScreen() {
	return (
		<GluestackUIProvider>
			<Center>
				<HomepagePage />
			</Center>
		</GluestackUIProvider>
	);
}