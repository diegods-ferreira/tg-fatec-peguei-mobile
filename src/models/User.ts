import IOrder from './Order';
import ITrip from './Trip';

export default interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  facebook: string;
  instagram: string;
  phone: string;
  presentation: string;
  address: string;
  city: string;
  state: string;
  avatar: string;
  username: string;
  show_email: boolean;
  show_facebook: boolean;
  show_instagram: boolean;
  show_phone: boolean;
  rating_average: number;
  trips: ITrip[];
  created_at: string;
  updated_at: string;
  orders_as_requester: IOrder[];
  orders_as_deliveryman: IOrder[];
  avatar_url: string;
}
