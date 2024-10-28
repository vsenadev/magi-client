import React from "react";

export interface IInputText {
    placeholder: string;
    value: string | number | null;
    state: React.Dispatch<React.SetStateAction<string | number>>;
    icon: string;
    type: string;
    white: boolean;
    width: string;
    mask?: string;
    disabled?: boolean;
}