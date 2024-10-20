export interface ITable {
    header: IHeader[];
}

export interface IHeader {
    title: string;
    width: string;
    border: boolean;
}