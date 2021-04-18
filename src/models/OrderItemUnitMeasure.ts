import IOrderItem from './OrderItem';

export default interface IOrderItemUnitMeasure {
  id: string;
  initials: string;
  description: string;
  type: number;
  type_description: string;
  items_weight_measure: IOrderItem[];
  items_dimension_measure: IOrderItem[];
}
