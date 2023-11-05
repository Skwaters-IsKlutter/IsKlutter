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
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

import colors from '../config/colors.js';
import Routes from '../components/constants/Routes.js';

export default function SelectionTabs({ tabTitle1, tabTitle2, tabValue1, tabValue2 }) {
    const navigation = useNavigation();

    return (
        <Box>
            <Tabs bg={colors.primary} h="$10">
                <TabsTabList>
                    {/* Tab selection */}
                    <TabsTab value="tab1">
                        <Pressable onPress={() => navigation.navigate(Routes.HOMEPAGE)}>
                            <TabsTabTitle color={colors.white} fontWeight="$bold">{tabTitle1}</TabsTabTitle>
                        </Pressable>
                    </TabsTab>

                    <TabsTab value="tab2">
                        <Pressable onPress={() => navigation.navigate(Routes.COMMUNITY)}>
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