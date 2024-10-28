export interface IProduct {
    id: string;
    name: string;
    type: string;
    value: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    company_id: number;
}