import IOrder from './Order';
import IOrderItemCategory from './OrderItemCategory';
import IOrderItemUnitMeasure from './OrderItemUnitMeasure';

export default interface IOrderItem {
  id: string;
  order_id: string;
  order: IOrder;
  name: string;
  image: string;
  quantity: number;
  weight: number;
  width: number;
  height: number;
  depth: number;
  packing: string;
  category_id: number;
  category: IOrderItemCategory;
  weight_unit_id: number;
  weight_unit_measure: IOrderItemUnitMeasure;
  dimension_unit_id: number;
  dimension_unit_measure: IOrderItemUnitMeasure;
  description: string;
  created_at: string;
  updated_at: string;
  image_url: string;
}
