import { IProduct } from "./Products.interface";

export interface IDelivery {
  id: string,
  route_id: string,
  name: string,
  sender: string,
  companyId?: string,
  recipient: string,
  send_date: Date,
  expected_date?: Date,
  status: string,
  lock_status: string,
  starting_cep: string;
  destination_cep: string;
  sender_company: string,
  recipient_company: string,
  total: number | null,
  distance: number | null
  routeId?: string;
  starting_address?: number;
  destination_address?: number;
  startingCep?: string;
  startingNeighborhood?: string;
  starting_city?: string;
  starting_number?: number;
  starting_state?: string;
  starting_neighborhood?: string;
  destination_neighborhood?: string;
  starting_street?: string;
  destinationCep?: string;
  destinationNeighborhood?: string;
  destination_city?: string;
  destination_number?: number;
  destination_state?: string;
  destination_street?: string;
  expectedRoute?: string;
  tracedRoute?: string;
  products?: IProduct[];
  pdf?: any;
}

export interface IRoutePoint {
  latitude: number;
  longitude: number;
}

export interface IOneDelivery {
  starting_street: string;       // Rua de início
  starting_number: number;       // Número de início
  starting_city: string;         // Cidade de início
  starting_state: string;        // Estado de início
  destination_street: string;    // Rua de destino
  destination_number: number;    // Número de destino
  destination_city: string;      // Cidade de destino
  destination_state: string;     // Estado de destino
  status: string;                // Status da rota
  lock_status: string;           // Status da tranca
  expected_route: IRoutePoint[]; // Lista de pontos esperados na rota
  traced_route: IRoutePoint[];   // Lista de pontos percorridos na rota
}
