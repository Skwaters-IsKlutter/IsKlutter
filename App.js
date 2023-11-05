import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from './app/components/screens/LoginScreen.js';
import SignupScreen from './app/components/screens/SignupScreen.js';
import AllListingsScreen from './app/components/screens/AllListingsScreen.js';
import ListingsScreen from './app/components/screens/ListingsScreen.js';
import ProfileScreen from './app/components/screens/ProfileScreen.js';
import CommunityScreen from './app/components/screens/CommunityScreen.js';

import colors from './app/config/colors.js';

const Tab = createBottomTabNavigator();

function HomepageScreenTabs() {
	return (
		<Tab.Navigator>
			<Tab.Screen options={{headerShown: false, 
								tabBarIcon: ({ color, size }) => (
									<MaterialCommunityIcons name="apps" color={colors.primary} size={35} />),
								// tabBarLabelStyle: {color: colors.primary},
								}} 
						name="View Listings" component={AllListingsScreen} />
			<Tab.Screen options={{headerShown: false, 
								tabBarIcon: ({ color, size }) => (
									<MaterialCommunityIcons name="human-greeting" color={colors.primary} size={35} />
								)}}
						name="Community" component={CommunityScreen} />
		</Tab.Navigator>
	);
}

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
				<Stack.Screen options={{headerShown:false}} name="Signup" component={SignupScreen} />
				<Stack.Screen options={{headerShown:false}} name="Homepage" component={HomepageScreenTabs} />
				<Stack.Screen options={{headerShown:false}} name="Listings" component={ListingsScreen} />
				<Stack.Screen options={{headerShown:false}} name="Profile" component={ProfileScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}