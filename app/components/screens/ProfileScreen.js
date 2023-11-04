import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import ProfilePage from '../../src/Profile.js';

export default function ProfileScreen() {
    return (
        <GluestackUIProvider>
            <Center>
                <ProfilePage />
            </Center>
        </GluestackUIProvider>
    );
}