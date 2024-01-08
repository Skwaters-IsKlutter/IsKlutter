import React, { useEffect, useState } from 'react';
import {
    VStack,
    Heading,
    Box,
    ScrollView,
    HStack,
    Image,
    Button,
    ButtonText,
    Text,
    Input,
    InputField,
} from '@gluestack-ui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import SearchHeaderBack from '../components/SearchHeaderBack.js';
import ListingCard from '../components/ListingCard.js';
import TagLabel from '../components/TagLabel.js';
import ReplyBox from '../components/ReplyBox.js';
import { getFirestore, addDoc, collection, getDocs, query, where,  doc, updateDoc, arrayUnion, getDoc} from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';
import { FIREBASE_APP } from '../../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const db = getFirestore(FIREBASE_APP);
const auth = getAuth();

export default function ListingsPage() {
    const [username, setUsername] = useState(''); 
    const navigation = useNavigation();
    const [comment, setComment] = useState(''); 
    const [comments, setComments] = useState([]);
    const route = useRoute();
    const [description, setDescription] = useState([]);
    const [allComments, setAllComments] = useState([]); // State to hold all comments



    // Access the selected item data from the route parameters
    console.log('Route:', route);
    const selectedItem = route?.params?.selectedItem;
    console.log('Selected Item:', selectedItem);

    const listingsData = selectedItem
    ? [
        {
            productImage: { uri: selectedItem.listingImageURL },
            productName: selectedItem.listingPrice,
            productPrice: selectedItem.listingPrice,
            productDesc: selectedItem.listingDescription,
            sellerName: selectedItem.username,
            tags: selectedItem.listingTags.map((tag, index) => (
              <TagLabel key={index} tagName={tag} />
            )),
            //sellerImage: { uri: selectedItem.userIconURL }, // Use userIconURL as sellerImage
        },
    ]
    : [];

    const renderListings = () => {
      console.log('Listings Data:', listingsData);
      return listingsData.map((listings, index) => (
        <ListingCard
          key={index}
          productImage={listings.productImage?.uri ? listings.productImage : { uri: 'fallback_image_url' }}
          productName={listings.productName}
          productPrice={listings.productPrice}
          productDesc={listings.productDesc}
          sellerName={listings.sellerName}
          tags={listings.tags}
          //sellerImage={listing.sellerImage}
        />
      ));
    };
    
    
    const listingsRepliesData = [
        {
            replyUser: "kuromi",
            userIcon: require("../../assets/img/usericon.jpg"),
            replyText: "mine!",
            replyDate: "10/25/2023",
            replyTime:"12:58 PM"
        }, {
            replyUser: "sassag0rl",
            userIcon: require("../../assets/img/sassa.jpg"),
            replyText: "EPAL NG NAG MINE",
            replyDate: "10/25/2023",
            replyTime:"1:43 PM"
        }, 
    ];

    const renderListingsReply = () => {
        return listingsRepliesData.map((listing, index) =>
            <ReplyBox
                key={index}
                replyUser={listing.replyUser}
                userIcon={listing.userIcon}
                replyText={listing.replyText}
                replyDate={listing.replyDate}
                replyTime={listing.replyTime}
            />
        );
    }

    const renderListingComments = () => {
        if (!selectedItem || !comments[selectedItem.key]) {
            return null; // Return null or a message if no comments are available for the selected item
        }

        return comments[selectedItem.key].comments.map((commentData, index) => (
            <Box key={index} bg={colors.lightGray} p={4} borderRadius={12} mt={4}>
                <Text fontSize={16} fontWeight="bold">
                    {commentData.username}
                </Text>
                <Text fontSize={14} mt={2}>
                    {commentData.comment}
                </Text>
            </Box>
        ));
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!auth || !auth.currentUser) {
                    setTimeout(fetchUserData, 1000);
                    return;
                }
    
                const currentUser = auth.currentUser; // Reference auth.currentUser
                const userCollection = collection(db, 'users');
                const querySnapshot = await getDocs(query(userCollection, where('userID', '==', currentUser.uid)));
    
                querySnapshot.forEach((doc) => {
                    setUsername(doc.data().username); // Assuming 'username' field exists in the user document
                });
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };
    
        fetchUserData();
    }, []);


    
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userCollection = collection(db, 'listings');
                const querySnapshot = await getDocs(userCollection);
    
                const userData = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const userDataObj = {
                        key: data.key,
                        username: data.username
                    };
                    userData.push(userDataObj);
                });
    
                setDescription(userData);
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };
    
        fetchData();
    }, []);
    
     

   
    const addListingComment = async (key, comment) => {
        try {
            const currentUser = username; 
            const userDocRef = await addDoc(collection(db, 'ListingsComment'), {
                username: currentUser,
                Primary: key,
                comment: comment
            });
            console.log('Document written with ID:', userDocRef.id);
            Alert.alert('Comment Posted', 'Your comment has been posted successfully.');
        } catch (error) {
            console.error('Error adding document:', error);
            setError('Error creating user. Please try again.');
        }
    };


    useEffect(() => {
        const fetchComments = async () => {
            const commentsData = {};
    
            try {
                for (const userData of description) {
                    const commentQuery = query(
                        collection(db, 'ListingsComment'),
                        where('Primary', '==', userData.key)
                    );
                    const commentSnapshot = await getDocs(commentQuery);
                    const comments = [];
    
                    commentSnapshot.forEach((commentDoc) => {
                        const commentData = commentDoc.data();
                        comments.push({
                            username: commentData.username,
                            comment: commentData.comment
                        });
                    });
    
                    commentsData[userData.key] = {
                        username: userData.username,
                        comments: comments
                    };
                }
    
                setComments(commentsData);
            } catch (error) {
                console.error('Error fetching comments:', error.message);
            }
        };
    
        fetchComments();
    }, [description]);

    

    const initialCommentState = {};
    description.forEach(userData => {
        initialCommentState[userData.key] = ''; // Use a unique identifier as the key
    });

    const [commentTexts, setCommentTexts] = useState(initialCommentState);


return (
    // Parent box
    <Box w="100%" h="100%">
        {/*Search Bar*/}
        <SearchHeaderBack userIcon={require("../../assets/img/usericon.jpg")} back={navigation.goBack} />

        <Box p="$6" w="100%" maxWidth="$96" flex={1}>
            {/*Listings Label */}
            <VStack space="xs" pb="$2">
            <Heading fontSize={30} color={colors.secondary}>Listings</Heading>
            </VStack>

            <ScrollView>
                <VStack space="xs" flexWrap="wrap">
                    {renderListings()}
                </VStack>

                {/* Added a comment */}
                <Input bg={colors.white} borderColor={colors.secondary} h={80} w="75%">
                    <InputField
                        multiline={true}
                        size="md"
                        placeholder="Write a comment..."
                        value={comment}
                        onChangeText={(text) => setComment(text)} // Update the comment value in the state
                    />
                </Input>
                <Button
                variant="solid"
                size="sm"
                bg={colors.secondary}
                borderRadius={12}
                onPress={() => {
                    console.log('Key of the file:', selectedItem.key); // Log the key
                    addListingComment(selectedItem.key, comment); // Call addListingComment with key and comment
                }}
            >
                <ButtonText color={colors.white} fontSize="$sm">
                    Comment
                </ButtonText>
            </Button>

            <VStack space="md" mt={4}>
                    <Heading fontSize="$xl" color={colors.secondary}>Listing Comments</Heading>
                    {renderListingComments()}
                </VStack>


             
                
            </ScrollView>
        </Box>
    </Box>
 )
}
