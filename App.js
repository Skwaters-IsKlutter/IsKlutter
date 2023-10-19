import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './app/components/screens/LoginScreen.js';
import SignupScreen from './app/components/screens/SignupScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
				<Stack.Screen options={{headerShown:false}} name="Signup" component={SignupScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}