export interface IEmployees {
  id: string;
  picture: string;
  name: string;
  cpf: string;
  password?: string;
  telephone: string;
  email: string;
  status_account: string;
  type_account: string;
  company_id?: number | null;
  status_id?: number;
  company_name?: string;
}