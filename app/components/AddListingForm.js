import React from 'react';
import {
    VStack,
    Box,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField
} from '@gluestack-ui/themed';
import colors from '../config/colors.js';

export default function AddListingForm( { 
    listingFormLabel, 
    listingFormType, 
    listingFormPlaceholder, 
    listingFormValue, 
    listingFormBoxHeight, 
    listingFormMultiline, 
    onValueChange, 
} ) {
    const handleInputChange = (value) => {
        if (onValueChange) {
            onValueChange(value);
        }
    };
    return (
        <Box p={10}>
            <VStack top={-20}>
                <FormControl >
                    <FormControlLabel mb="$1">
                        <FormControlLabelText color={colors.secondary} fontWeight={600}>{listingFormLabel}</FormControlLabelText>
                    </FormControlLabel>

                    <Input w="100%" bg={colors.white} h={listingFormBoxHeight} borderRadius={10}>
                        <InputField
                            type={listingFormType}
                            placeholder={listingFormPlaceholder}
                            value={listingFormValue}
                            multiline={listingFormMultiline}
                            onChangeText={handleInputChange}
                        />
                    </Input>
                </FormControl>
            </VStack>
        </Box>
    );
}