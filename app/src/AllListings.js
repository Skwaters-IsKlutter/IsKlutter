import React, { useEffect, useState } from 'react';
import {
    HStack,
    VStack,
    Heading,
    Box, 
    ScrollView,
    Button,
    ButtonIcon,
    ButtonText,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchHeader from '../components/SearchHeader.js';
import ItemCard from '../components/ItemCard.js';
import TagLabel from '../components/TagLabel.js';
import colors from '../config/colors.js'
import Routes from '../components/constants/Routes.js';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../../config/firebase'; // Import your Firebase configuration

export default function AllListingsPage() {
    const navigation = useNavigation();
    const [allListingsData, setAllListingsData] = useState([]);

    const fetchAllListings = async () => {
        const listingsCollection = collection(database, 'listings');
        const listingsSnapshot = await getDocs(listingsCollection);

        const listingsData = listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllListingsData(listingsData);
    };

    useEffect(() => {
        fetchAllListings();
    }, []);

    const renderAllListings = () => {
        return allListingsData.map((item) => (
            <ItemCard
                key={item.id}
                productImage={item.listingImage || require("../../assets/img/item.jpg")}
                productPrice={item.listingPrice}
                productName={item.listingName}
                productSeller={item.username}
                toListing={() => navigation.navigate(Routes.LISTING, { item })}
            />
        ));
    };

    return (
        // Parent box
        <Box w="100%" h="100%">
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