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
    TabsTab,
    Pressable
} from '@gluestack-ui/themed';
import { Alert } from 'react-native';

import colors from '../config/colors.js';

export default function SelectionTabs({ tabTitle1, tabTitle2, tabValue1, tabValue2 }) {
    return (
        <Box>
            <Tabs bg={colors.primary} h="$10">
                <TabsTabList>
                    {/* Tab selection */}
                    <TabsTab value="tab1">
                        <Pressable onPress={() => Alert.alert("Alert", "This is a dummy action")}>
                            <TabsTabTitle color={colors.white} fontWeight="$bold">{tabTitle1}</TabsTabTitle>
                        </Pressable>
                    </TabsTab>

                    <TabsTab value="tab2">
                        <Pressable onPress={() => Alert.alert("Alert", "This is a dummy action")}>
                            <TabsTabTitle color={colors.white} fontWeight="$bold">{tabTitle2}</TabsTabTitle>
                        </Pressable>
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
        </Box>
    )
}