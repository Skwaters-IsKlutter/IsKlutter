
import React, { useState } from "react";
import {
    // Box,
    // View,
    // Text,
    // Image,
    // TouchableOpacity,
    VStack,
    FormControl,
    FormControlLabel,
    FormControlError,
    FormControlErrorText,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
    FormControlErrorIcon,
} from "@gluestack-ui/themed";
import { View, Text, Image, TouchableOpacity,  
    StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

import colors from "../config/colors";

export default function AddListingImagePicker({ listingFormLabel }) {

    // Stores the selected image URI 
    const [file, setFile] = useState('');

    // Stores any error message 
    const [error, setError] = useState();

    // Function to pick an image from  
    //the device's media library '
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {

            // If permission is denied, show an alert 
            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera  
                 roll permission to upload images.`
            );
        } else {

            // Launch the image library and get 
            // the selected image 
            const result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) {

                // If an image is selected (not cancelled),  
                // update the file state variable 
                setFile(result.uri);

                // Clear any previous errors 
                setError('');
            }
        }
    };
    return (
        <VStack space="xl" m={5}>
            {/* <FormControl size="md">
                <FormControlLabel mb="$2">
                    <FormControlLabelText color={colors.secondary} fontWeight={600}>{listingFormLabel}</FormControlLabelText>
                </FormControlLabel>
            </FormControl> */}

            <TouchableOpacity onPress={pickImage}>
                <Text>Click</Text>
            </TouchableOpacity>

            {file ? (
                // Display the selected image 
                <View>
                    <Image source={{ uri: file }}
                        style={styles.image} />
                </View>
            ) : (
                // Display an error message if there's  
                // an error or no image selected 
                <Text>{error}</Text>
            )}
        </VStack>
    );
}