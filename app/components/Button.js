import React from "react";
import { Button, ButtonText } from "@gluestack-ui/theme";

function Button({props}) {
    return (
        <Button
            size={props.size}
            action={props.action}
            isDisabled={false}
        >
        <ButtonText>{props.text}</ButtonText>
        </Button>
    )
}

export default Button;