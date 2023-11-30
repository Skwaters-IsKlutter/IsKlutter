import React, { useEffect, useState } from 'react';
import {
    HStack,
    VStack,
    Heading,
    Box, 
    ScrollView,
    Button,
    ButtonIcon,
    ButtonText
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SearchHeader from '../components/SearchHeader.js';
import ItemCard from '../components/ItemCard.js';
import TagLabel from '../components/TagLabel.js';

import colors from '../config/colors.js'
import Routes from '../components/constants/Routes.js';

// import { auth} from '../../config/firebase';
// import { where, getFirestore, doc, getDoc, collection, query, getDocs } from 'firebase/firestore'; // Import necessary Firebase modules
// import { FIREBASE_APP } from '../../config/firebase'; 
// const db = getFirestore(FIREBASE_APP);

export default function AllListingsPage() {
    const navigation = useNavigation();

    const allListingsData = [
        {
            key: 1,
            productImage: require("../../assets/img/item.jpg") ,
            productName: "Kuromi Plush",
            productPrice: "PHP 450",
            productSeller: "cinnamonroll",
            tags: [<TagLabel tagName="Toys" />],
            toListing: () => navigation.navigate(Routes.LISTING, {item})
        }, {
            key: 2,
            productImage: require("../../assets/img/item2.jpg") ,
            productName: "UP Shirt",
            productPrice: "PHP 250",
            productSeller: "sassag0rl",
            tags: [<TagLabel tagName="Clothing" />]
        }
    ]

    const renderAllListings = () => {
        return allListingsData.map((item, index) =>
            <ItemCard
                key={index}
                productImage={item.productImage}
                productPrice={item.productPrice}
                productName={item.productName}
                productSeller={item.productSeller}
                tags={item.tags}
                toListing={item.toListing}
                // toListing={() => navigation.navigate(Routes.LISTING, {item})}
            />
        );
    }
    
    const [userColor, setUserColor] = useState(colors.secondary); // Default color is primary

    useEffect(() => {
        const fetchUserColor = async () => {
          try {
            // Ensure Firebase is initialized
            if (!auth || !auth.currentUser) {
                
              // Firebase might not be initialized yet, wait and retry
              setTimeout(fetchUserColor, 1000);
              return;
            }
            
            const user = auth.currentUser;
            const userCollection = collection(db, "users")
            const column = query(userCollection, where("userID","==",`${user.uid}`))
            const userDoc = await getDocs(column);
            
            let bgcolor = null;
            
            userDoc.forEach((doc)=> {
                // console.log(doc.id, "=>", doc.data())
                bgcolor = doc.data()["color"];
                // console.log(bgcolor)
            })
            console.log(bgcolor)
            setUserColor(bgcolor)
        } catch (error) {
            console.error('Error fetching user color:', error.message);
        }
    };
        fetchUserColor();
        
    }, []);

    return (
        // Parent box
        <Box w="100%" h="100%" backgroundColor={userColor}>
            {/*Search Bar*/}
            <SearchHeader userIcon={ require("../../assets/img/usericon.jpg") } />

            <Box p="$6" w="100%" maxWidth="$96" flex={1}>
                {/*Listings Label and post button */}
                <VStack space="xs" pb="$2">
                    <HStack space="xs" justifyContent="space-between" alignItems="center">
                        <Heading lineHeight={60} fontSize="$5xl" color={colors.secondary}>Listings</Heading>
                        <Button borderRadius={8} backgroundColor={colors.secondary} onPress={() => navigation.navigate(Routes.ADDLISTING)}>
                            <ButtonIcon>
                                <MaterialCommunityIcons name="post" size={15} color={colors.white} />
                            </ButtonIcon>
                            <ButtonText>Post</ButtonText>
                        </Button>
                    </HStack>
                </VStack>

                {/*Listing Box Container*/}
                <ScrollView>
                    <HStack space="xs" flexWrap="wrap" justifyContent="center">
                        {renderAllListings()}
                    </HStack>
                </ScrollView>
            </Box>
        </Box>
    )
}