import React, { useState } from 'react';
import {
    Box,
    Text,
    VStack,
    FormControl, 
    FormControlLabel, 
    FormControlError, 
    FormControlErrorText, 
    FormControlLabelText, 
    FormControlHelper, 
    FormControlHelperText, 
    FormControlErrorIcon, 
    Image,
    Button,
    ButtonText,
    Input,
    InputField,
} from '@gluestack-ui/themed';

import AddListingForm from './AddListingForm.js';
import AddListingImagePicker from '../components/AddListingImagePicker.js'
import AddTags from './AddTags.js';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { Alert } from 'react-native';
import { FIREBASE_APP } from '../../config/firebase'; 
const db = getFirestore(FIREBASE_APP);
// Initialize Firestore

import colors from '../config/colors.js';

export default function AddListingBox({ user }) {
   

    return (
        <Box p="$2" bg={colors.medium} borderRadius={12}>
            <Box w="100%" maxWidth="$60" pb={0}>

              
            </Box>
        </Box>

        
    )
}