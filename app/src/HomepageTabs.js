import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ListingsScreen from '../components/screens/ListingsScreen';

const Tab = createBottomTabNavigator();

export default function HomepageTabs() {
    return (
        <Tab.Navigator initialRouteName="Listings">
            <Tab.Screen name="Listings" component={ListingsScreen} />
            {/* <Tab.Screen name="Community" component={SettingsScreen} /> */}
        </Tab.Navigator>
    )
}