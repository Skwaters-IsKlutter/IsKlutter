import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import LoginPage from './src/Login.js';

export default function App() {
	return (
		<GluestackUIProvider>
			<Center>
				<LoginPage />
			</Center>
		</GluestackUIProvider>
	);
}