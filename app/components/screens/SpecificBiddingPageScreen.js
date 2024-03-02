import React from 'react';
import { GluestackUIProvider, Center } from '@gluestack-ui/themed';

import SpecificBiddingPage from '../../src/SpecificBidding.js';

export default function SpecificBiddingScreen(){
    return(
        <GluestackUIProvider>
            <Center>
                <SpecificBiddingPage />
            </Center>
        </GluestackUIProvider>
    )
}