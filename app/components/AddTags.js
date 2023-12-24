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

const AddTags = ({ listingFormLabel, listingFormPlaceholder, setListingData }) => {
    const [mainTags, setMainTags] = React.useState("");
    const [selectedTags, setSelectedTags] = React.useState([]);

    const Tags = [
        { key: 'food', value: 'Food' },
        { key: 'clothing', value: 'Clothing' },
        { key: 'accessories', value: 'Accessories' },
        { key: 'appliances', value: 'Appliances' },
        { key: 'toys', value: 'Toys' },
        { key: 'schoolessential', value: 'School Essentials' },
        { key: 'footwear', value: 'Footwear' },
    ];

    const renderCheckbox = () => {
        if (mainTags === 'food') {
            return (
                <Box>
                    <CheckBox
                        checkBoxLabel="Gluten-free"
                        onValueChange={(value) => handleTagChange(value, 'glutenFree')}
                        ariaLabel="Gluten-free Checkbox"
                    />
                </Box>
            );
        } else if (['clothing', 'accessories', 'toys'].includes(mainTags)) {
            return (
                <Box>
                    <CheckBox
                        checkBoxLabel="Hypoallergenic"
                        onValueChange={(value) => handleTagChange(value, 'hypoallergenic')}
                        ariaLabel="Hypoallergenic Checkbox"
                    />
                </Box>
            );
        }
        return null;
    };

    const handleTagChange = (value, tagName) => {
        const newTags = value
            ? [...selectedTags, tagName]
            : selectedTags.filter((tag) => tag !== tagName);

        console.log('newTags:', newTags);  // Log the newTags array

        setSelectedTags(newTags);
        setListingData((prevData) => {
            console.log('prevData:', prevData);  // Log the previous data
            return { ...prevData, listingTags: newTags }
        });
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
                setSelected={setMainTags}
                data={Tags}
                placeholder={listingFormPlaceholder}
                defaultOption={{ key: 'food', value: 'Food' }}
            />

            {renderCheckbox()}
        </Box>
    );
};

export default AddTags;
