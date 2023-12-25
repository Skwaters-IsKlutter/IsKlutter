
import React, { useState } from "react";
import { VStack, } from "@gluestack-ui/themed";
import { View, Text, Image, TouchableOpacity,  StyleSheet, Alert } from "react-native";
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

                // Access the selected asset using the assets array
                const selectedAsset = result.assets[0];
                setFile(selectedAsset.uri);
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

            {/* <TouchableOpacity onPress={pickImage}>
                <Button variant="solid" size="sm" bg={colors.primary} borderRadius={10} m={2}>
                    <ButtonText color={colors.white} fontSize="$sm">Add Photo</ButtonText>
                </Button>
        </TouchableOpacity> */}

            <TouchableOpacity onPress={pickImage} style={styles.button}>
                <Text style={styles.text}>Add Photo</Text>
            </TouchableOpacity>

            {file ? (
                // Display the selected image 
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: file }}
                        style={styles.image} 
                    />
                </View>
            ) : (
                // Display an error message if there's  
                // an error or no image selected 
                <Text>{error}</Text>
            )}
        </VStack>
    );
}

const styles = StyleSheet.create({
    text: {
        color: colors.white,
        fontSize: 15
    }, 
    button: {
        alignItems: "center",
        backgroundColor: colors.primary,
        padding: 10,
        marginTop: 10,
        marginHorizontal: 70,
        borderRadius: 50
    },
    imageContainer: {
        flex: 1,  // This ensures that the image takes up the entire available space
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,  // Adjust the width and height as needed
        height: 200,
        resizeMode: 'cover',  // Adjust the resizeMode based on your requirements
        borderRadius: 10,     // Optional: Add border radius for rounded corners
    },
});

