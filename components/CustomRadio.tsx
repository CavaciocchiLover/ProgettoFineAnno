import React from "react";
import {Radio} from "@heroui/radio";
import {cn} from "@heroui/theme";

//@ts-ignore
export const CustomRadio = (props) => {
    const {children, ...otherProps} = props;

    return (
        <Radio
            {...otherProps}
            classNames={{
                base: cn(
                    "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                    "flex-row-reverse max-w-[100%] cursor-pointer rounded-lg gap-4 p-4 border-2",
                    "data-[selected=true]:border-primary",
                ),
            }}
        >
            {children}
        </Radio>
    );
};