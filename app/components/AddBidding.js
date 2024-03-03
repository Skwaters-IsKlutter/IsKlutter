import React, { useState } from 'react';
import {
    HStack,
    VStack,
    Box,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Checkbox,
    CheckboxIndicator,
    CheckIcon,
    CheckboxLabel,
    CheckboxIcon,
    Input,
    InputField
} from '@gluestack-ui/themed';

import colors from '../config/colors.js';

const AddBidding = ({ listingFormLabel, listingFormStartingPlaceholder, listingFormEndingPlaceholder, listingFormType }) => {
    const [enableBidding, setEnableBidding] = useState(false);
    const [startBiddingTime, setStartBiddingTime] = useState('');
    const [endBiddingTime, setEndBiddingTime] = useState('');

    const handleBiddingCheckboxChange = () => {
        setEnableBidding(!enableBidding);
        if (!enableBidding) {
            setStartBiddingTime('');
            setEndBiddingTime('');
        }
    };

    return (
        <Box p={10}>
            <VStack top={-30}>
                <FormControl>
                    <FormControlLabel mb="$1">
                        <FormControlLabelText color={colors.secondary} fontWeight={600}>
                            {listingFormLabel}
                        </FormControlLabelText>
                    </FormControlLabel>
                </FormControl>
                <Checkbox
                    size="md"
                    isInvalid={false}
                    isDisabled={false}
                    isChecked={enableBidding}
                    onChange={handleBiddingCheckboxChange}
                >
                    <CheckboxIndicator mr={2}>
                        <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel>Enable Bidding</CheckboxLabel>
                </Checkbox>
                {enableBidding && (
                    <>

                        <FormControl>
                            <FormControlLabel mb="$1" mt={10}>
                                <FormControlLabelText color={colors.secondary} fontWeight={600}>
                                    Start Time
                                </FormControlLabelText>
                            </FormControlLabel>
                            <Input w="100%">
                                <InputField
                                    type={listingFormType}
                                    placeholder={listingFormStartingPlaceholder}
                                    value={startBiddingTime}
                                    onChange={(e) => setStartBiddingTime(e.target.value)}
                                />
                            </Input>
                        </FormControl>

                        <FormControl>
                            <FormControlLabel mb="$1" mt={10}>
                                <FormControlLabelText color={colors.secondary} fontWeight={600}>
                                    End Time
                                </FormControlLabelText>
                            </FormControlLabel>
                            <Input>
                                <InputField
                                    type={listingFormType}
                                    placeholder={listingFormEndingPlaceholder}
                                    value={endBiddingTime}
                                    onChange={(e) => setEndBiddingTime(e.target.value)}
                                />
                            </Input>
                        </FormControl>
                    </>
                )}

            </VStack>
        </Box>
    );
};

export default AddBidding;
