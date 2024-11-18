import React from "react";

export interface IInputText {
    placeholder?: string;
    value: number | null;
    state: (value: string) => void;
    icon?: string;
    white?: boolean;
    width?: string;
    type?: string;
    disabled?: boolean;
    mask?: string;
}

export interface ICurrencyInputText extends IInputText {
    prefix?: string;
    decimalSeparator?: string;
    groupSeparator?: string;
}
