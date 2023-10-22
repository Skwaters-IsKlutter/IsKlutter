import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import LoginPage from '../../src/Login.js';

export default function LoginScreen() {
	return (
		<GluestackUIProvider>
			<Center>
				<LoginPage />
			</Center>
		</GluestackUIProvider>
	);
}