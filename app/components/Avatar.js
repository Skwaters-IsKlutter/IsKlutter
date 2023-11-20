import React from "react";
import { Avatar, AvatarFallbackText, AvatarImage } from "@gluestack-ui/themed";

import colors from "../config/colors";

export default function UserAvatar( {username, userIcon} ) {
    return (
        <Avatar bgColor={colors.primary} size="md" borderRadius="$full" h={40} w={40} ml={10}>
            <AvatarFallbackText color={colors.white}>{username}</AvatarFallbackText>
            <AvatarImage source={userIcon} />
        </Avatar>
    )
}