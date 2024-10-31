export interface ISelectOption {
    backgroundBlue?: boolean;
    placeholder: string;
    active: boolean;
    setActive: (active: boolean) => void;
    options: IOption[];
    width: string;
    value: string | undefined;
    setValue: (value: string) => void;
}

export interface IOption {
    value: string;
    name: string;
}