export interface DetailPurchase {
  id_detail_purchases?: string,
  id_purchases?: number,
  id_products: number
  count: number;
  unit_price: number;
  value_taxes: number;
  total: number
}