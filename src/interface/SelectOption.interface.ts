export interface ISelectOption {
    placeholder: string;
    active: boolean;
    setActive: (active: boolean) => void;
    options: IOption[];
    width: string;
    value: string;
    setValue: (value: string) => void;
}

export interface IOption {
    name: string;
}