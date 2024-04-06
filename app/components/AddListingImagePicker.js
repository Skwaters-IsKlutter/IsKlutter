import React, { useState } from "react";
import { VStack } from "@gluestack-ui/themed";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
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

    const handleImagePress = () => {
        // Reset image state when image is pressed
        setImageBlob(null);
        setImageSource(null);
        setError('');
        setListingData((prevData) => ({ ...prevData, listingImage: null }));
    };

    return (
        <VStack space="xl" m={5} mt={-10}>
            {imageSource ? (
                <TouchableOpacity onPress={handleImagePress}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={imageSource}
                            style={styles.image}
                        />
                    </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={pickImage} style={styles.addPhotoButton}>
                    <MaterialCommunityIcons name="image-plus" color={colors.white} style={styles.icon}/>
                    <Text style={styles.text}>Add Photo</Text>
                </TouchableOpacity>
            )}

            {error ? <Text>{error}</Text> : null}
        </VStack>
    );
}

const styles = StyleSheet.create({
    text: {
        color: colors.white,
        alignItems: "center",
        marginTop: 10,
        fontSize: 15,
    },
    button: {
        alignItems: "center",
        backgroundColor: colors.primary,
        padding: 5,
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
    addPhotoButton: {
        alignItems: "center",
        backgroundColor: colors.primary,
        padding: 10,
        marginTop: 25,
        marginHorizontal: 100 ,
        height: 150,
        width:150,
        borderRadius:10
    },
    icon:{
        marginTop: 30,
        fontSize: 40
    }
});
