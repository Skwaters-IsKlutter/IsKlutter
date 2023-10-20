import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import HomePage from './src/HomePage.js';

export default function App() {
	return (
		<GluestackUIProvider>
			<Center>
				<HomePage />
			</Center>
		</GluestackUIProvider>
	);
}