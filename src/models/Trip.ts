import IOrder from './Order';
import IUser from './User';

export default interface ITrip {
  id: string;
  user_id: string;
  user: IUser;
  destination_city: string;
  destination_state: string;
  departure_date: string;
  return_city: string;
  return_state: string;
  return_date: string;
  status: number;
  created_at: string;
  updated_at: string;
  orders: IOrder[];
}
