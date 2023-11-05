import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import CommunityPage from '../../src/Community.js';

export default function CommunityScreen() {
    return (
        <GluestackUIProvider>
            <Center>
                <CommunityPage />
            </Center>
        </GluestackUIProvider>
    );
}