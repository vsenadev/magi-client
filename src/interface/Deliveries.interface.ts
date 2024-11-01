export interface IDelivery {
  id: string,
  route_id: string,
  name: string,
  sender: string,
  companyId?: string,
  recipient: string,
  send_date: string,
  expected_date: string,
  status: string,
  lock_status: string,
  cepStarting: string;
  cepDestination: string;
  sender_company: string,
  recipient_company: string,
  total: number | null,
  distance: number | null
  expectedDate?: Date;
  routeId?: string;
  startingAddress?: number;
  destinationAddress?: number;
  startingCep?: string;
  startingNeighborhood?: string;
  startingCity?: string;
  startingNumber?: number;
  startingState?: string;
  startingStreet?: string;
  destinationCep?: string;
  destinationNeighborhood?: string;
  destinationCity?: string;
  destinationNumber?: number;
  destinationState?: string;
  destinationStreet?: string;
  expectedRoute?: string;
  tracedRoute?: string;
  products?: string;
  pdf?: any;
}