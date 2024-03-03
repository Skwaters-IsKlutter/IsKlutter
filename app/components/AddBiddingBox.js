import React from 'react';
import {
    Box,
} from '@gluestack-ui/themed';

import AddBidding from './AddBidding.js';

export default function AddBiddingBox({ onValueChange, listingFormLabel, listingFormValue, listingFormType, listingFormStartingPlaceholder, listingFormEndingPlaceholder }) {
    const handleInputChange = (value) => {
        // Call the onValueChange prop to handle changes in the parent component
        if (onValueChange) {
            onValueChange(value);
        }
    };
    
    return (
        <Box>
            <Box w="100%" m={5}>
                <AddBidding
                    listingFormType="text"
                    listingFormStartingPlaceholder="Enter start time"
                    listingFormEndingPlaceholder="Enter end time"
                    listingFormValue={listingFormValue}
                    onChangeText={handleInputChange}
                />
            </Box>
        </Box>
    )
}
