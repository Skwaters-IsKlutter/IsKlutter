import React from 'react';
import { Box } from '@gluestack-ui/themed';

// import AddListingForm from './AddListingForm';
import AddListingImagePicker from '../components/AddListingImagePicker';
import AddBiddingForm from './AddBiddingForm';
import AddTags from './AddTags';

// biddingName, biddingPrice, setListingData
export default function AddBiddingBox({ listingName, listingPrice, listingDescription, listingTags, setListingData }) {
    return (
        <Box>
            <Box w="100%" p="$3">
                <AddListingImagePicker
                    setListingData={setListingData}
                />

                <AddBiddingForm
                    biddingFormLabel="Bidding Title"
                    biddingFormType="text"
                    biddingFormPlaceholder="Enter bidding name"
                    biddingFormValue={listingName}
                    biddingFormBoxHeight="$10"
                    listingFormMultiline={false}
                    biddingFormMaxLength={32}
                    onValueChange={(value) => setListingData((prevData) => ({ ...prevData, listingName: value }))} //biddingName
                />

                <AddBiddingForm
                    biddingFormLabel="Starting Bid Price"
                    biddingFormType="number"
                    biddingFormPlaceholder="Enter minimum bid amount"
                    biddingFormValue={listingPrice}
                    biddingFormBoxHeight="$10"
                    onValueChange={(value) => setListingData((prevData) => ({ ...prevData, listingPrice: value }))} // biddingPrice
                />

                <AddBiddingForm
                    biddingFormLabel="Description"
                    biddingFormType="text"
                    biddingFormPlaceholder="Enter description"
                    biddingFormValue={listingDescription}
                    biddingFormMultiline={true}
                    biddingFormMaxLength={160}
                    biddingFormBoxHeight={100}
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
