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
    { key: 'Food', value: 'Food' },
    { key: 'Beverages', value: 'Beverages' },
    { key: 'Clothing', value: 'Clothing' },
    { key: 'Accessories', value: 'Accessories' },
    { key: 'Appliances', value: 'Appliances' },
    { key: 'Toys', value: 'Toys' },
    { key: 'School Essential', value: 'School Essentials' },
    { key: 'Footwear', value: 'Footwear' },
    { key: 'Kitcherware', value: 'Kitchenware' },
    { key: 'Others', value: 'Others' },
];

const AddTags = ({ listingFormLabel, listingFormPlaceholder, setListingData }) => {
    const [mainTags, setMainTags] = React.useState("");
    const [selectedTags, setSelectedTags] = React.useState([]);
    const [secondaryTags, setSecondaryTags] = React.useState([]);

    // Ensure that listingTags is always initialized as an array
    const [listingTags, setListingTags] = React.useState(Tags.filter(tagInfo => tagInfo.key === mainTags));

    const renderCheckbox = () => {
        if (mainTags === 'Food') {
            return (
                <Box>
                    <CheckBox
                        checkBoxLabel="Gluten-free"
                        onValueChange={(value) => handleSecondaryTagChange(value, 'Gluten Free')}
                        ariaLabel="Gluten-free Checkbox"
                    />
                </Box>
            );
        } else if (['Clothing', 'Accessories', 'Toys', 'Others'].includes(mainTags)) {
            return (
                <Box>
                    <CheckBox
                        checkBoxLabel="Hypoallergenic"
                        onValueChange={(value) => handleSecondaryTagChange(value, 'Hypoallergenic')}
                        ariaLabel="Hypoallergenic Checkbox"
                    />
                </Box>
            );
        } else if (['Beverages'].includes(mainTags)) {
            return (
                <Box>
                    <CheckBox
                        checkBoxLabel="Alcoholic"
                        onValueChange={(value) => handleSecondaryTagChange(value, 'Alcoholic')}
                        ariaLabel="Alcoholic Checkbox"
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
        const updatedTags = Array.from(new Set([mainTag, ...secondaryTags]));
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
        <Box p={10}>
            <VStack top={-25}>
                <FormControlLabel mb="$2">
                    <FormControlLabelText color={colors.secondary} fontWeight={600}>
                        {listingFormLabel}
                    </FormControlLabelText>
                </FormControlLabel>

                <SelectList
                setSelected={handleMainTagChange}
                data={Tags}
                placeholder={listingFormPlaceholder}
                defaultOption={{ key: 'Food', value: 'Food' }}
            />

            {renderCheckbox()}
            </VStack>

            
        </Box>
    );
};

export default AddTags;