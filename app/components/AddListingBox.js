import React from 'react';
import { Box } from '@gluestack-ui/themed';

import AddListingForm from './AddListingForm';
import AddListingImagePicker from '../components/AddListingImagePicker';
import AddTags from './AddTags';

export default function AddListingBox({ listingName, listingPrice, listingDescription, listingTags, setListingData }) {
    return (
        <Box>
            <Box w="100%" p="$3">
                <AddListingImagePicker
                    setListingData={setListingData}
                />

                <AddListingForm
                    listingFormLabel="Listing Title"
                    listingFormType="text"
                    listingFormPlaceholder="Enter listing name"
                    listingFormValue={listingName}
                    listingFormBoxHeight="$10"
                    listingFormMultiline={false}
                    listingFormMaxLength={32}
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
                    listingFormMaxLength={160}
                    listingFormBoxHeight={100}
                    onValueChange={(value) => setListingData((prevData) => ({ ...prevData, listingDescription: value }))}
                />

                <AddTags 
                    listingFormLabel="Tags"
                    listingFormPlaceholder="Select a Tag"
                    listingTags={listingTags} 
                    setListingData={setListingData}
                />

            </Box>
        </Box>
    )
}
