import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import LoginPage from './src/Login.js';
import SignupPage from './src/Signup.js';

export default function App() {
	return (
		<GluestackUIProvider>
			<Center>
				<SignupPage />
			</Center>
		</GluestackUIProvider>
	);
}