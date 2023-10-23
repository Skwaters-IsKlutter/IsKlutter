import React from 'react';

import { Alert } from 'react-native';

import SelectionTabs from './SelectionTabs.js';

import colors from '../config/colors.js';

export default function TabsFooter() {
    return (
        <SelectionTabs
            tabTitle1="Listings" 
            tabValue1={() => Alert.alert('Show Alert Action', 'Listings pressed')}

            tabTitle2="Community"
            tabValue2="Community" />
    )
}