import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import MessagesPage from '../../src/Messages';

export default function MessagesScreen() {
    return (
        <GluestackUIProvider>
            <Center>
                <MessagesPage />
            </Center>
        </GluestackUIProvider>
    );
}