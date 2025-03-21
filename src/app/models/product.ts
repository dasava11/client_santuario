export interface Product {
  id_product?: number;
  name: string;
  description: string;
  brand: string;
  stock: number;
  buy_price: number;
  code_earn: number;
  unit_price: number;
  code: string;
  taxes_code: number;
  total:number;
  active: boolean
}