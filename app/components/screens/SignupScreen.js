import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import SignupPage from '../../src/Signup.js';

export default function SignupScreen() {
	return (
		<GluestackUIProvider>
			<Center>
				<SignupPage />
			</Center>
		</GluestackUIProvider>
	);
}