import { DetailShoppings } from "./detailShoppings";

export interface Shopping {
  id_shopping?: number;
  date: Date;
  userId: number;
  customer?: number;
  payment_method: string
  taxes: number;
  subtotal: number;
  total_sale: number;
  detail_shoppings: DetailShoppings[];
  }