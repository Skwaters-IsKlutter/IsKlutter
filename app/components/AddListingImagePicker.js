import React, { useState } from "react";
import { VStack } from "@gluestack-ui/themed";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

import colors from "../config/colors";

export default function AddListingImagePicker({ listingFormLabel, setListingData }) {
    const [imageBlob, setImageBlob] = useState(null);
    const [imageSource, setImageSource] = useState(null);
    const [error, setError] = useState('');

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera roll permission to upload images.`
            );
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) {
                const selectedAsset = result.assets[0];
                const response = await fetch(selectedAsset.uri);
                const blob = await response.blob();

                setImageBlob(blob);
                setError('');

                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageSource({ uri: reader.result });
                };
                reader.onerror = (readError) => {
                    setError('Error reading image: ' + readError.message);
                };
                reader.readAsDataURL(blob);

                setListingData((prevData) => ({ ...prevData, listingImage: blob }));
            }
        }
    };

    return (
        <VStack space="xl" m={5}>
            <TouchableOpacity onPress={pickImage} style={styles.button}>
                <Text style={styles.text}>Add Photo</Text>
            </TouchableOpacity>

            {imageSource ? (
                <View style={styles.imageContainer}>
                    <Image
                        source={imageSource}
                        style={styles.image}
                    />
                </View>
            ) : (
                <Text>{error}</Text>
            )}
        </VStack>
    );
}

const styles = StyleSheet.create({
    text: {
        color: colors.white,
        fontSize: 15,
    },
    button: {
        alignItems: "center",
        backgroundColor: colors.primary,
        padding: 10,
        marginTop: 10,
        marginHorizontal: 70,
        borderRadius: 50,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
    },
});
