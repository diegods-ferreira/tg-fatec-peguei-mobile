export default interface IChatMessage {
  id: string;
  chat_id: string;
  from: string;
  to: string;
  text: string;
  created_at: string;
}
