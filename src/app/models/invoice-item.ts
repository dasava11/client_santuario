export interface InvoiceItem {
    productName: string; // Nombre del producto
    quantity: number;     // Cantidad comprada
    total: number;        // Precio total (incluyendo impuestos)
    id_products: number;
  }