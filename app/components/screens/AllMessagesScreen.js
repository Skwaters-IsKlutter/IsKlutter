import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import AllMessagesPage from '../../src/AllMessages';

export default function AllMessagesScreen() {
    return (
        <GluestackUIProvider>
            <Center>
                <AllMessagesPage />
            </Center>
        </GluestackUIProvider>
    );
}