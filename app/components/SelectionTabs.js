import React from 'react';
import {
    Box,
    VStack,
    HStack,
    Button,
    ButtonText,
    Heading,
    Text,
    Tabs,
    TabsTabTitle,
    TabsTabPanels,
    TabsTabPanel,
    TabsTabList,
    TabsTab
} from '@gluestack-ui/themed';

import colors from '../config/colors.js';

export default function SelectionTabs( {tabTitle1, tabTitle2, tabValue1, tabValue2} ) {
    return (
        <Tabs>
            <TabsTabList bg={colors.primary}>
            {/* Tab selection */}
                <TabsTab value="tab1">
                    <TabsTabTitle color={colors.white}>{tabTitle1}</TabsTabTitle>
                </TabsTab>

                <TabsTab value="tab2">
                    <TabsTabTitle color={colors.white}>{tabTitle2}</TabsTabTitle>
                </TabsTab>
            </TabsTabList>

            {/* Tab values */}
            <TabsTabPanels mt="$4">
                <TabsTabPanel value="tab1">
                    <Text>{tabValue1}</Text>
                </TabsTabPanel>
                <TabsTabPanel value="tab2">
                    <Text>{tabValue2}</Text>
                </TabsTabPanel>
            </TabsTabPanels>
        </Tabs>
    )
}