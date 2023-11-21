import React from 'react';
import {
    Checkbox,
    CheckIcon,
    CheckboxIndicator,
    CheckboxLabel,
    CheckboxIcon,
} from '@gluestack-ui/themed';


import colors from '../config/colors.js';


export default function CheckBox({ checkBoxLabel }) {
    return (
        <Checkbox m={10} size="sm" isInvalid={false} isDisabled={false}>
            <CheckboxIndicator mr="$2">
                <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>{checkBoxLabel}</CheckboxLabel>
        </Checkbox>
    );
};

