import React from 'react';
import { Box } from '@gluestack-ui/themed';

// import AddListingForm from './AddListingForm';
import AddListingImagePicker from '../components/AddListingImagePicker';
import AddBiddingForm from './AddBiddingForm';
// import AddTags from './AddTags';

export default function AddBiddingBox({ biddingName, biddingPrice,setListingData }) {
    return (
        <Box>
            <Box w="100%" m={5}>
                <AddListingImagePicker
                    setListingData={setListingData}
                />

                <AddBiddingForm
                   biddingFormLabel="Bidding Title"
                   biddingFormType="text"
                   biddingFormPlaceholder="Enter bidding name"
                   biddingFormValue={biddingName}
                   biddingFormBoxHeight="$10"
                   onValueChange={(value) => setListingData((prevData) => ({ ...prevData, biddingName: value }))}
                />

                <AddBiddingForm
                    biddingFormLabel="Minimum Bid Amount"
                    biddingFormType="number"
                    biddingFormPlaceholder="Enter minimum bid amount"
                    biddingFormValue={biddingPrice}
                    biddingFormBoxHeight="$10"
                    onValueChange={(value) => setListingData((prevData) => ({ ...prevData, biddingPrice: value }))}
                />

            </Box>
        </Box>
    )
}
