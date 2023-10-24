import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './app/components/screens/LoginScreen.js';
import SignupScreen from './app/components/screens/SignupScreen.js';
import CommunityScreen from './app/components/screens/CommunityScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Community">
				<Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
				<Stack.Screen options={{headerShown:false}} name="Signup" component={SignupScreen} />
				<Stack.Screen options={{headerShown:false}} name="Community" component={CommunityScreen} />
			</Stack.Navigator>
		</NavigationContainer>

		//<NavigationContainer>
		//	<CommunityScreen />
		//</NavigationContainer>
		
	);
}