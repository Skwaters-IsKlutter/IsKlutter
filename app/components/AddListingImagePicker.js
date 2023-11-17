
import React, { useState } from "react";
import {
    View,
    Text, 
    Image, 
    TouchableOpacity,
    Alert
} from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";

export default function App() {

    // Stores the selected image URI 
    const [file, setFile] = useState(null);

    // Stores any error message 
    const [error, setError] = useState(null);

    // Function to pick an image from  
    //the device's media library 
    const pickImage = async () => {
        const { status } = await ImagePicker.
            requestMediaLibraryPermissionsAsync();

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
            const result =
                await ImagePicker.launchImageLibraryAsync();

            if (!result.cancelled) {

                // If an image is selected (not cancelled),  
                // update the file state variable 
                setFile(result.uri);

                // Clear any previous errors 
                setError(null);
            }
        }
    }; 
    return {
        
    };
}