import React, { useState } from "react";
import { VStack } from "@gluestack-ui/themed";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../config/colors";

export default function PostBoxImagePicker({ setListingData }) {
    const [imageBlobs, setImageBlobs] = useState([]);
    const [imageSources, setImageSources] = useState([]);
    const [error, setError] = useState("");

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera roll permission to upload images.`
            );
        } else {
            const currentCount = imageBlobs.length;
            const maxImages = 3;
    
            if (currentCount >= maxImages) {
                Alert.alert(
                    "Maximum Images Reached",
                    `You can only select up to ${maxImages} images.`
                );
                return;
            }
    
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 1,
                selectionLimit: maxImages - currentCount,
            });
    
            if (!result.canceled && result.assets) {
                const selectedAssets = result.assets.slice(0, maxImages - currentCount);
    
                if (selectedAssets) {
                    const newImageBlobs = [];
                    const newImageSources = [];
    
                    for (const asset of selectedAssets) {
                        const response = await fetch(asset.uri);
                        const blob = await response.blob();
    
                        newImageBlobs.push(blob);
    
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            newImageSources.push({ uri: reader.result });
    
                            if (newImageSources.length === selectedAssets.length) {
                                setImageBlobs((prevBlobs) => [...prevBlobs, ...newImageBlobs]);
                                setImageSources((prevSources) => [...prevSources, ...newImageSources]);
    
                                setListingData((prevData) => ({
                                    ...prevData,
                                    listingImages: [...prevData.listingImages, ...newImageBlobs],
                                    hasImage: true,
                                }));
                            }
                        };
                        reader.readAsDataURL(blob);
                    }
                }
            }
        }
    };
    

    const handleImagePress = (index) => {
        const newImageBlobs = [...imageBlobs];
        const newImageSources = [...imageSources];

        newImageBlobs.splice(index, 1);
        newImageSources.splice(index, 1);

        setImageBlobs(newImageBlobs);
        setImageSources(newImageSources);
        setListingData((prevData) => ({
            ...prevData,
            listingImages: newImageBlobs,
            hasImage: newImageBlobs.length > 0,
        }));
    };

    return (
        <VStack space="sm" alignItems="center">
            {imageSources.length > 0 ? (
                <View style={styles.imageContainer}>
                    {imageSources.map((source, index) => (
                        <TouchableOpacity key={index} onPress={() => handleImagePress(index)}>
                            <Image source={source} style={styles.image} />
                        </TouchableOpacity>
                    ))}
                </View>
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
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: "cover",
        borderRadius: 10,
        margin: 5,
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
