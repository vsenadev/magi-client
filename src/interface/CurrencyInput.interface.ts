export interface IInputText {
    placeholder?: any; // Placeholder adicionado como opcional
    value: any; // Removed null para evitar problemas
    state: (value: string | number) => void;
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
