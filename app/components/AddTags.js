// AddTags.js

import React from 'react';
import {
    FormControlLabel,
    FormControlLabelText,
    Box,
    VStack,
} from '@gluestack-ui/themed';
import { SelectList } from 'react-native-dropdown-select-list';
import CheckBox from './CheckBox.js';

import colors from '../config/colors.js';

const Tags = [
    { key: 'food', value: 'Food' },
    { key: 'clothing', value: 'Clothing' },
    { key: 'accessories', value: 'Accessories' },
    { key: 'appliances', value: 'Appliances' },
    { key: 'toys', value: 'Toys' },
    { key: 'schoolessential', value: 'School Essentials' },
    { key: 'footwear', value: 'Footwear' },
    { key: 'kitcherware', value: 'Kitchenware' },
];

const AddTags = ({ listingFormLabel, listingFormPlaceholder, setListingData }) => {
    const [mainTags, setMainTags] = React.useState("");
    const [selectedTags, setSelectedTags] = React.useState([]);
    const [secondaryTags, setSecondaryTags] = React.useState([]);

    // Ensure that listingTags is always initialized as an array
    const [listingTags, setListingTags] = React.useState(Tags.filter(tagInfo => tagInfo.key === mainTags));

    const renderCheckbox = () => {
        if (mainTags === 'food') {
            return (
                <Box>
                    <CheckBox
                        checkBoxLabel="Gluten-free"
                        onValueChange={(value) => handleSecondaryTagChange(value, 'Gluten Free')}
                        ariaLabel="Gluten-free Checkbox"
                    />
                </Box>
            );
        } else if (['clothing', 'accessories', 'toys'].includes(mainTags)) {
            return (
                <Box>
                    <CheckBox
                        checkBoxLabel="Hypoallergenic"
                        onValueChange={(value) => handleSecondaryTagChange(value, 'Hypoallergenic')}
                        ariaLabel="Hypoallergenic Checkbox"
                    />
                </Box>
            );
        }
        return null;
    };

    const handleSecondaryTagChange = (value, secondaryTagName) => {
        const newSecondaryTags = value
          ? [...secondaryTags, secondaryTagName]
          : secondaryTags.filter((tag) => tag !== secondaryTagName);
        setSecondaryTags(newSecondaryTags);
        updateListingTags(mainTags, newSecondaryTags);
    };

    const updateListingTags = (mainTag, secondaryTags) => {
        const updatedMainTag = mainTag.charAt(0).toUpperCase() + mainTag.slice(1); // Capitalize the first letter
        const updatedTags = Array.from(new Set([updatedMainTag, ...secondaryTags]));
        setListingData((prevData) => ({
          ...prevData,
          listingTags: updatedTags,
        }));
        console.log('Updated Tags: ', updatedTags);
    };

    // Update the main tag and reset selectedTags when it changes
    const handleMainTagChange = (value) => {
        setMainTags(value);
        setSelectedTags([]);
        setListingTags(Tags.filter(tagInfo => tagInfo.key === value));
        setSecondaryTags([]); // Reset secondaryTags when main tag changes
        updateListingTags(value, []); // Update listingTags with only the main tag
    };

    return (
        <Box>
            <VStack space="xl" m={5}>
                <FormControlLabel mb="$2">
                    <FormControlLabelText color={colors.secondary} fontWeight={600}>
                        {listingFormLabel}
                    </FormControlLabelText>
                </FormControlLabel>
            </VStack>

            <SelectList
                setSelected={handleMainTagChange}
                data={Tags}
                placeholder={listingFormPlaceholder}
                defaultOption={{ key: 'food', value: 'Food' }}
            />

            {renderCheckbox()}
        </Box>
    );
};

export default AddTags;