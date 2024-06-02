import React, { useState} from 'react';
import { Box, Text, VStack, Button, Input, InputField, Image } from '@gluestack-ui/themed';
import colors from '../config/colors.js';
import { getFirestore, addDoc, collection, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_APP, storage} from '../../config/firebase';
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { useUser } from '../components/UserIcon.js';
import PostBoxImagePicker from './PostBoxImagePicker';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function PostBox() {
    const [postDescription, setPostDescription] = useState('');
    const [listingData, setListingData] = useState({ listingImage: null, hasImage: false }); // Ensure hasImage is initialized to false
    const { userProfileImg } = useUser();

    const postForum = async () => {
        try {
            if (!auth || !auth.currentUser) {
                console.error('User not authenticated');
                return;
            }

            const user = auth.currentUser;
            const userID = user.uid;

            if (!userID) {
                console.error('User ID not available');
                return;
            }

            if (postDescription) {
                const imageName = `image_${Date.now()}`;
                const storagePath = `communityImage/${imageName}.jpeg`;
                const file = listingData.listingImage;
                const imageRef = storageRef(storage, storagePath);
                const metadata = { contentType: 'image/jpeg' };
                await uploadBytes(imageRef, file, metadata);
                const downloadURL = await getDownloadURL(imageRef);

                const docRef = await addDoc(collection(db, 'forum'), {
                    userID: userID,
                    description: postDescription,
                    timestamp: new Date(),
                    key: '',
                    image: storagePath,
                    imageURL: downloadURL,
                    hasImage: listingData.hasImage // Ensure hasImage is included in the document
                });

                setPostDescription('');
                setListingData({ listingImage: null, hasImage: false }); // Reset hasImage after posting
                await updateDoc(docRef, { key: docRef.id });
                alert('Success', 'Post added successfully');
                console.log("Post added successfully");
            } else {
                console.error('Post description is empty');
            }
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <Box>
            <VStack space="sm" justifyContent="space-evenly" alignItems="center" p="$3">
                {userProfileImg && (
                    <Image
                        source={{ uri: userProfileImg }}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                        alt="user profile"
                    />
                )}
                <PostBoxImagePicker setListingData={setListingData} />
                <Input bg={colors.white} borderColor={colors.secondary} h="30%" w="100%" zIndex={0}>
                    <InputField
                        multiline={true}
                        size="md"
                        placeholder="Write a post..."
                        value={postDescription}
                        onChangeText={(text) => setPostDescription(text)}
                    />
                </Input>
                

                
            </VStack>
            <VStack p="$3">
            <Button variant="solid" 
                    size="sm" 
                    bg={colors.secondary} 
                    borderRadius={30} 
                    onPress={postForum} ml={3}>
                    <Text color={colors.white} fontSize="$sm">
                        Post
                    </Text>
                </Button>
            </VStack>
        </Box>
    );
}
