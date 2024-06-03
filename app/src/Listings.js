import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { VStack, Box, ScrollView, Heading, Button, Text } from '@gluestack-ui/themed';
import { Alert } from 'react-native';  // Import Alert
import ListingCard from '../components/ListingCard';
import TagLabel from '../components/TagLabel';
import CommentBox from '../components/CommentBox';
import ReplyBox from '../components/ReplyBox';
import colors from '../config/colors';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { FIREBASE_APP } from '../../config/firebase';
import BackHeader from '../components/BackHeader';
import { useFonts, Poppins_700Bold, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import fonts from '../config/fonts.js';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function ListingsPage() {

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
        Poppins_700Bold
    })
    const navigation = useNavigation();
    const route = useRoute();
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserProfileImg, setCurrentUserProfileImg] = useState('');
    const [listingComments, setListingComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const selectedItem = route?.params?.selectedItem || null;
    const sellerImageURL = route?.params?.sellerImageURL || null;

    useEffect(() => {
        console.log('Selected Item:', selectedItem);

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userCollectionRef = collection(db, 'users');
                const userQuery = query(userCollectionRef, where('userID', '==', user.uid));
                setCurrentUser(user);
                try {
                    const userQuerySnapshot = await getDocs(userQuery);
                    if (!userQuerySnapshot.empty && userQuerySnapshot.docs[0]) {
                        const userProfileImg = userQuerySnapshot.docs[0].data().userProfileImg || '';
                        setCurrentUserProfileImg(userProfileImg);
                    } else {
                        setCurrentUserProfileImg('');
                        console.error(`User document not found for uid: ${user.uid}`);
                    }
                } catch (error) {
                    setCurrentUserProfileImg('');
                    console.error('Error fetching user document:', error);
                }
            } else {
                setCurrentUserProfileImg('');
            }
        });

        return () => {
            if (typeof unsubscribeAuth === 'function') {
                unsubscribeAuth();
            }
        };
    }, []);

    useEffect(() => {
        if (selectedItem) {
            fetchListingComments();
        }
    }, [selectedItem]);

    const fetchListingComments = async () => {
        console.log('Fetching comments for listing ID:', selectedItem.id);

        const commentsCollectionRef = collection(db, 'ListingsComments');
        const listingCommentsQuery = query(commentsCollectionRef, where('itemId', '==', selectedItem.id));

        try {
            const listingCommentsSnapshot = await getDocs(listingCommentsQuery);
            if (!listingCommentsSnapshot.empty) {
                const commentsData = listingCommentsSnapshot.docs.map((commentDoc) => commentDoc.data());
                console.log('Fetched comments:', commentsData);
                setListingComments(commentsData);
            } else {
                console.log('No comments found.');
                setListingComments([]);
            }

            const unsubscribeListener = setupCommentsListener();
            return () => {
                unsubscribeListener();
            };
        } catch (error) {
            console.error('Error fetching listing comments:', error);
        }
    };

    const setupCommentsListener = () => {
        const commentsCollectionRef = collection(db, 'ListingsComments');
        const listingCommentsQuery = query(commentsCollectionRef, where('itemId', '==', selectedItem.id));

        const unsubscribe = onSnapshot(listingCommentsQuery, (snapshot) => {
            const commentsData = snapshot.docs.map((commentDoc) => commentDoc.data());
            console.log('Updated comments:', commentsData);
            setListingComments(commentsData);
        });
        return unsubscribe;
    };

    const addComment = async () => {
        try {
            const newCommentRef = await addDoc(collection(db, 'ListingsComments'), {
                itemId: selectedItem.id,
                userId: currentUser.uid,
                comment: newComment,
                timestamp: serverTimestamp(),
            });
            console.log('New comment added with ID:', newCommentRef.id);
            setListingComments((prevComments) => [
                ...prevComments,
                {
                    userId: currentUser.uid,
                    comment: newComment,
                    timestamp: new Date(),
                },
            ]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding new comment:', error);
        }
    };

    const handleSoldClick = async () => {
        if (!selectedItem) return;

        const listingRef = doc(db, 'listings', selectedItem.id);

        try {
            await updateDoc(listingRef, {
                sold: true,
            });
            console.log(`Listing ${selectedItem.id} marked as sold.`);
            Alert.alert("Success", "This item is now marked as sold.");
        } catch (error) {
            console.error('Error updating listing as sold:', error);
        }
    };

    const renderListings = () => {
        return selectedItem ? (
            <ListingCard
                productID={selectedItem.id}
                productImage={{ uri: selectedItem.listingImageURL || 'fallback_image_url' }}
                productName={selectedItem.listingName}
                productPrice={selectedItem.listingPrice}
                productDesc={selectedItem.listingDescription}
                sellerName={selectedItem.username}
                sellerID={selectedItem.sellerID}
                sellerImageURL={sellerImageURL}
                tags={selectedItem.listingTags.map((tag, index) => <TagLabel key={index} tagName={tag} />)}
                timestamp={selectedItem.listingTimestamp ? selectedItem.listingTimestamp.toDate().toLocaleString() : 'N/A'}
            />
        ) : null;
    };

    const renderListingComments = () => {
        const sortedComments = [...listingComments].sort((a, b) => a.timestamp - b.timestamp);
        return sortedComments.map((comment, index) => (
            <ReplyBox
                key={index}
                replyUser={comment.userId}
                replyText={comment.comment}
                replyDate={comment.timestamp ? comment.timestamp.toDate().toLocaleDateString() : 'N/A'}
                replyTime={comment.timestamp ? comment.timestamp.toDate().toLocaleTimeString() : 'N/A'}
            />
        ));
    };

    return (
        <Box w="100%" h="100%">
            <BackHeader userIcon={require('../../assets/img/usericon.jpg')} back={navigation.goBack} headerText="Product Details" />
            <Box p="$2" w="100%"  flex={1}>
                <ScrollView>
                    <VStack space="xs">
                        {renderListings()}
                    </VStack>
                    {currentUser && selectedItem && currentUser.uid === selectedItem.sellerID && (
                        <Button
                            variant="solid"
                            size="sm"
                            bg={colors.primary}
                            borderRadius={50}
                            onPress={handleSoldClick}
                            m={5}
                        >
                            <Text color={colors.white} fontSize="$sm">Sold</Text>
                        </Button>
                    )}

                    <VStack pt="$5">
                        <CommentBox
                            selectedItem={selectedItem}
                            posterUserId={currentUser ? currentUser.uid : null}
                            posterIcon={currentUserProfileImg ? { uri: currentUserProfileImg, key: currentUserProfileImg } : require("../../assets/img/profile-holder.jpg")}
                            onCommentChange={(comment) => setNewComment(comment)}
                            onAddComment={addComment}
                        />
                    </VStack>
                    
                    <VStack >
                        <Text pt="$5" pl="$2"fontSize="$xl" color={colors.secondary} fontFamily={fonts.semibold}>Comments</Text>
                        <VStack >
                            {renderListingComments()}
                        </VStack>
                    </VStack>

                    
                </ScrollView>
            </Box>
        </Box>
    );
}
