import React from "react";

export interface IInputText {
    placeholder: string;
    value: string | number | undefined | null | Date;
    state: React.Dispatch<React.SetStateAction<any>>;
    icon: string;
    type: string;
    white: boolean;
    width: string;
    mask?: string;
    disabled?: boolean;
    min?: number;
}