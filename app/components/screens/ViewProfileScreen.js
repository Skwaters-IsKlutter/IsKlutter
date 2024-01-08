import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import ViewProfilePage from '../../src/ViewProfile.js';

export default function ViewProfileScreen() {
    return (
        <GluestackUIProvider>
            <Center>
                <ViewProfilePage />
            </Center>
        </GluestackUIProvider>
    );
}