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
import AllMessagesScreen from './app/components/screens/AllMessagesScreen.js';
import AddListingScreen from './app/components/screens/AddListingScreen.js';
import PrivateMessageScreen from './app/components/screens/PrivateMessageScreen.js';
import EditProfileScreen from './app/src/EditProfileModal.js';
import IndividualPostScreen from './app/components/screens/IndividualPostScreen.js';
import ViewProfileScreen from './app/components/screens/ViewProfileScreen.js';
import AllBiddingsScreen from './app/components/screens/AllBiddingsScreen.js';
import SpecificBiddingScreen from './app/components/screens/SpecificBiddingPageScreen.js';
import AddBiddingScreen from './app/components/screens/AddBiddingScreen.js';

import colors from './app/config/colors.js';
import { UserProvider } from './app/components/UserIcon.js';
import SpecificBiddingPage from './app/src/SpecificBidding.js';



const Tab = createBottomTabNavigator();

function HomepageScreenTabs() {
	return (
		<Tab.Navigator screenOptions={{tabBarStyle:{backgroundColor: '#285656', height: 50 },
									   tabBarActiveBackgroundColor:'teal',
									   tabBarActiveTintColor:'white'}}>
			<Tab.Screen options={{headerShown: false, 
								tabBarIcon: ({ color, size }) => (
									<MaterialCommunityIcons name="apps" color={colors.white} size={35} />),
									
								tabBarLabelStyle: {top:-5},
								}} 
						name="View Listings" component={AllListingsScreen} />
			<Tab.Screen options={{headerShown: false, 
								tabBarIcon: ({ color, size }) => (
									<MaterialCommunityIcons name="account-group" color={colors.white} size={35} />
								), 
								tabBarLabelStyle: {top:-5},}}
						name="Community" component={CommunityScreen} />
			<Tab.Screen options={{headerShown: false, 
								tabBarIcon: ({ color, size }) => (
									<MaterialCommunityIcons name="cash-multiple" color={colors.white} size={30} />
								), 
								tabBarLabelStyle: {top:-5},}}
						name="Biddings" component={AllBiddingsScreen} />
		</Tab.Navigator>
	);
}

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<UserProvider>
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
				<Stack.Screen options={{headerShown:false}} name="Signup" component={SignupScreen} /> 
				<Stack.Screen options={{headerShown:false}} name="Homepage" component={HomepageScreenTabs} />
				<Stack.Screen options={{headerShown:false}} name="Listings" component={ListingsScreen} />
				<Stack.Screen options={{headerShown:false}} name="Profile" component={ProfileScreen} />
				<Stack.Screen options={{headerShown:false}} name="Messages" component={AllMessagesScreen} />
				<Stack.Screen options={{headerShown:false}} name="PrivateMessage" component={PrivateMessageScreen} />
				<Stack.Screen options={{headerShown:false}} name="AddListing" component={AddListingScreen} />
				<Stack.Screen options={{headerShown:false}} name="EditProfile" component={EditProfileScreen} />
				<Stack.Screen options={{headerShown:false}} name="IndividualPost" component={IndividualPostScreen} />
				<Stack.Screen options={{headerShown:false}} name="ViewProfile" component={ViewProfileScreen} />
				<Stack.Screen options={{headerShown:false}} name="SpecificBidding" component={SpecificBiddingScreen} /> 
				<Stack.Screen options={{headerShown:false}} name="AddBidding" component={AddBiddingScreen} /> 
			</Stack.Navigator>
		</NavigationContainer>
		</UserProvider>
	);
}