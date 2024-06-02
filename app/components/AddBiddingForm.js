import React from 'react';
import {
    VStack,
    Box,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField,
} from '@gluestack-ui/themed';
import colors from '../config/colors.js';

export default function AddBiddingForm( { 
    biddingFormLabel, 
    biddingFormType, 
    biddingFormPlaceholder, 
    biddingFormValue, 
    biddingFormBoxHeight, 
    biddingFormMaxLength,
    biddingFormMultiline,
    biddingFormLineNum,
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
                        <FormControlLabelText color={colors.secondary} fontWeight={600}>{biddingFormLabel}</FormControlLabelText>
                    </FormControlLabel>

                    <Input w="100%" bg={colors.white} h={biddingFormBoxHeight} borderRadius={10}>
                        <InputField
                            type={biddingFormType}
                            placeholder={biddingFormPlaceholder}
                            value={biddingFormValue}
                            multiline={biddingFormMultiline}
                            maxLength={biddingFormMaxLength}
                            numberOfLines={biddingFormLineNum}
                            onChangeText={handleInputChange}
                        />
                    </Input>
                </FormControl>
            </VStack>
        </Box>
    );
}