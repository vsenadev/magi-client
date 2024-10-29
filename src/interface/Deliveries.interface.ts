export interface IDelivery {
    name: string;
    sender: number;
    recipient: number;
    send_date: string;
    expected_date: string;
    status_id: number;
    lock_status: number;
    route_id: string;
    startingAddress: number;
    destination: number;
    products: number;
}