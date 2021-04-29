export default interface IUserRate {
  _id: string;
  order_id: string;
  requester_id: string;
  deliveryman_id: string;
  rate: number;
  comment: string;
  created_at: string;
  updated_at: string;
}
