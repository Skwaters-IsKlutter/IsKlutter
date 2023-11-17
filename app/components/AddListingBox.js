import React from 'react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Image,
    Button,
    ButtonText,
    Input,
    InputField,
} from '@gluestack-ui/themed';

import AddListingForm from './AddListingForm.js';

import colors from '../config/colors.js';

export default function AddListingBox( {user, listingImage, listingName, listingPrice, listingDescription, listingTags} ) {
    return (
        <Box p="$2" bg={colors.medium} borderRadius={12}>
            <Box w="100%" maxWidth="$60" pb={0}>

                <AddListingForm 
                    listingFormLabel="Listing Title"
                    listingFormType="text"
                    listingFormPlaceholder="Enter listing name"
                    listingFormValue={listingName}
                    listingFormBoxHeight="$10"
                />

                <AddListingForm 
                    listingFormLabel="Price"
                    listingFormType="number"
                    listingFormPlaceholder="Enter listing price"
                    listingFormValue={listingPrice}
                    listingFormBoxHeight="$10"
                />

                <AddListingForm 
                    listingFormLabel="Description"
                    listingFormType="text"
                    listingFormPlaceholder="Enter listing description"
                    listingFormValue={listingDescription}
                    listingFormMultiline={true}
                    listingFormBoxHeight={100}
                />

                <AddListingForm 
                    listingFormLabel="Tags"
                    listingFormType="text"
                    listingFormPlaceholder="Enter listing tags"
                    listingFormValue={listingTags}
                    listingFormBoxHeight="$10"
                />
            </Box>
        </Box>

        
    )
}