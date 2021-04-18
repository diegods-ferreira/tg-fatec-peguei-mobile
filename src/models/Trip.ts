import IOrder from './Order';
import IUser from './User';

export default interface ITrip {
  id: string;
  user_id: string;
  user: IUser;
  destination: string;
  return_location: string;
  destination_latitude: number;
  destination_longitude: number;
  departure_date: string;
  return_date: string;
  created_at: string;
  updated_at: string;
  orders: IOrder[];
}
