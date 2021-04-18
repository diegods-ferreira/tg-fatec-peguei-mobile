import IChat from './Chat';
import IOrderItem from './OrderItem';
import IRequestPickupOffer from './RequestPickupOffer';
import ITrip from './Trip';
import IUser from './User';

export default interface IOrder {
  id: string;
  deliveryman_id: string;
  deliveryman: IUser;
  requester_id: string;
  requester: IUser;
  pickup_date: string;
  pickup_establishment: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_latitude: number;
  delivery_longitude: number;
  delivery_value: number;
  purchase_invoice: string;
  trip_id: string;
  status: number;
  created_at: string;
  updated_at: string;
  number: number;
  items: IOrderItem[];
  trip: ITrip[];
  chat: IChat;
  request_pickup_offers: IRequestPickupOffer[];
  purchase_invoice_url: string;
}
