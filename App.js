import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/Login.js';
import SignupScreen from './src/Signup.js';

function LandingPage() {
	return (
	<GluestackUIProvider>
		<Center>
			<LoginScreen />
		</Center>
	</GluestackUIProvider>
	);
}

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen options={{headerShown:false}} name="Login" component={LandingPage} />
				<Stack.Screen options={{headerShown:false}} name="Signup" component={SignupScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}