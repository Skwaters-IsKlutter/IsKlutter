import React from 'react';
import {
    VStack,
    Heading,
    Image,
    Box,
    Button,
    ButtonText,
    FormControl,
    FormControlLabel,
    FormControlError,
    FormControlErrorText,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
    FormControlErrorIcon,
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
        // Call the onValueChange prop to handle changes in the parent component
        if (onValueChange) {
            onValueChange(value);
        }
    };
    return (
        <VStack space="xl" m={5}>
            <FormControl size="md">
                <FormControlLabel mb="$2">
                    <FormControlLabelText color={colors.secondary} fontWeight={600}>{listingFormLabel}</FormControlLabelText>
                </FormControlLabel>

                <Input w="100%" bg={colors.white} h={listingFormBoxHeight}>
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
    );
}