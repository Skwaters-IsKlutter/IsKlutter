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
import AddListingImagePicker from '../components/AddListingImagePicker.js'
import AddTags from './AddTags.js';

import colors from '../config/colors.js';

export default function AddListingBox( {user, listingImage, listingName, listingPrice, listingDescription, listingTags, setListingData} ) {
    return (
        <Box p="$2" bg={colors.medium} borderRadius={12}>
            <Box w="100%" maxWidth="$60" pb={0}>

                <AddListingImagePicker 
                    listingFormLabel="Upload an Image"
                /> 

                <AddListingForm 
                    listingFormLabel="Listing Title"
                    listingFormType="text"
                    listingFormPlaceholder="Enter listing name"
                    listingFormValue={listingName}
                    listingFormBoxHeight="$10"
                    onValueChange={(value) => setListingData((prevData) => ({ ...prevData, listingName: value }))}
                />

                <AddListingForm 
                    listingFormLabel="Price"
                    listingFormType="number"
                    listingFormPlaceholder="Enter listing price"
                    listingFormValue={listingPrice}
                    listingFormBoxHeight="$10"
                    onValueChange={(value) => setListingData((prevData) => ({ ...prevData, listingPrice: value }))}
                    
                />

                <AddListingForm 
                    listingFormLabel="Description"
                    listingFormType="text"
                    listingFormPlaceholder="Enter listing description"
                    listingFormValue={listingDescription}
                    listingFormMultiline={true}
                    listingFormBoxHeight={100}
                    onValueChange={(value) => setListingData((prevData) => ({ ...prevData, listingDescription: value }))}
                />

                <AddTags
                    listingFormLabel="Tags"
                    listingFormPlaceholder="Select a Tag"
                    onTagChange={(tags) => setListingData((prevData) => ({ ...prevData, listingTags: tags }))}
                />

            </Box>
        </Box>
    )
}