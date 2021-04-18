import IOrder from './Order';
import IUser from './User';

export default interface IRequestPickupOffer {
  id: string;
  order_id: string;
  deliveryman_id: string;
  delivery_value: number;
  created_at: string;
  deliveryman: IUser;
  order: IOrder;
}
