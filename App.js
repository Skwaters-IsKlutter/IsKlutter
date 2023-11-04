import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './app/components/screens/LoginScreen.js';
import SignupScreen from './app/components/screens/SignupScreen.js';
import HomepageScreen from './app/components/screens/HomepageScreen.js';
import ListingsScreen from './app/components/screens/ListingsScreen.js';
import ProfileScreen from './app/components/screens/ProfileScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
				<Stack.Screen options={{headerShown:false}} name="Signup" component={SignupScreen} />
				<Stack.Screen options={{headerShown:false}} name="Homepage" component={HomepageScreen} />
				<Stack.Screen options={{headerShown:false}} name="Listings" component={ListingsScreen} />
				<Stack.Screen options={{headerShown:false}} name="Profile" component={ProfileScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}