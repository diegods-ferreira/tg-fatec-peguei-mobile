import IOrder from './Order';
import IUser from './User';

export default interface IChat {
  id: string;
  order_id: string;
  deliveryman_id: string;
  requerter_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  last_message_text: string;
  last_message_sent_at: string;
  last_message_sent_by: string;
  order: IOrder;
  deliveryman: IUser;
  requester: IUser;
}
