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
import fonts from '../config/fonts.js';

export default function AddListingForm( { 
    listingFormLabel, 
    listingFormType, 
    listingFormPlaceholder, 
    listingFormValue, 
    listingFormBoxHeight, 
    listingFormMultiline, 
    listingFormMaxLength,
    listingFormLineum,
    onValueChange, 
} ) {
    const handleInputChange = (value) => {
        if (onValueChange) {
            onValueChange(value);
        }
    };
    return (
        <Box p={10}>
            <VStack top={-10}>
                <FormControl >
                    <FormControlLabel mb="$1">
                        <FormControlLabelText color={colors.secondary} fontWeight={600} fontFamily={fonts.bold}> {listingFormLabel}</FormControlLabelText>
                    </FormControlLabel>

                    <Input w="100%" bg={colors.white} h={listingFormBoxHeight} borderRadius={10}>
                        <InputField
                            type={listingFormType}
                            placeholder={listingFormPlaceholder}
                            value={listingFormValue}
                            multiline={listingFormMultiline}
                            maxLength={listingFormMaxLength}
                            numberOfLines={listingFormLineum}
                            onChangeText={handleInputChange}
                        />
                    </Input>
                </FormControl>
            </VStack>
        </Box>
    );
}