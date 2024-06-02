import React, { useState } from "react";
import { VStack } from "@gluestack-ui/themed";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../config/colors";

export default function PostBoxImagePicker({ setListingData }) {
    const [imageBlob, setImageBlob] = useState(null);
    const [imageSource, setImageSource] = useState(null);
    const [error, setError] = useState("");

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera roll permission to upload images.`
            );
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();

            if (!result.cancelled) {
                const selectedAsset = result.assets[0];
                const response = await fetch(selectedAsset.uri);
                const blob = await response.blob();

                setImageBlob(blob);
                setError("");

                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageSource({ uri: reader.result });
                };
                reader.onerror = (readError) => {
                    setError("Error reading image: " + readError.message);
                };
                reader.readAsDataURL(blob);

                // Set hasImage to true when an image is picked
                setListingData((prevData) => ({ ...prevData, listingImage: blob, hasImage: true }));
            }
        }
    };

    const handleImagePress = () => {
        setImageBlob(null);
        setImageSource(null);
        setError("");
        setListingData((prevData) => ({ ...prevData, listingImage: null, hasImage: false }));
    };

    return (
        <VStack space="sm" alignItems="center">
            {imageSource ? (
                <TouchableOpacity onPress={handleImagePress}>
                    <View style={styles.imageContainer}>
                        <Image source={imageSource} style={styles.image} />
                    </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={pickImage} style={styles.addPhotoButton}>
                    <MaterialCommunityIcons name="image-plus" color={colors.white} style={styles.icon} />
                    <Text style={styles.text}>Add Photo</Text>
                </TouchableOpacity>
            )}

            
        </VStack>
    );
}

const styles = StyleSheet.create({
    text: {
        color: colors.white,
        marginTop: 10,
        fontSize: 15,
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "cover",
        borderRadius: 10,
        marginVertical: 10,
    },
    addPhotoButton: {
        alignItems: "center",
        backgroundColor: colors.secondary,
        padding: 10,
        marginVertical: 15,
        height: 150,
        width: 150,
        borderRadius: 10,
    },
    icon: {
        fontSize: 40,
        marginTop: 30,
    },
});
