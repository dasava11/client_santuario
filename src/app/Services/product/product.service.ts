import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/product';

interface ApiResponse<T> {
  success?: boolean;
  message: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private PRODUCT_URL = environment.PRODUCT_URL; 

  constructor(private http: HttpClient) {}

  // 🔹 Obtener todos los productos
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.PRODUCT_URL}`)
      .pipe(catchError(error => this.handleError('Error al obtener productos', error)));
  }

  // 🔹 Obtener un producto por ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.PRODUCT_URL}/${id}`)
      .pipe(catchError(error => this.handleError('Error al obtener el producto', error)));
  }

  // 🔹 Obtener un producto por nombre
  getProductByName(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.PRODUCT_URL}?name=${name}`)
      .pipe(catchError(error => this.handleError('Error al buscar producto por nombre', error)));
  }

  // 🔹 Obtener un producto por código
  getProductByCode(code: string): Observable<Product> {
    return this.http.get<Product>(`${this.PRODUCT_URL}/code/${code}`)
      .pipe(catchError(error => this.handleError('Error al buscar producto por código', error)));
  }

  // 🔹 Crear un producto
  createProduct(data: Product): Observable<ApiResponse<Product>> {
    console.log('Enviando datos:', data); // Verifica en consola
    return this.http.post<ApiResponse<Product>>(`${this.PRODUCT_URL}`, data)
      .pipe(catchError(error => this.handleError('Error al crear el producto', error)));
  }

  // 🔹 Actualizar stock y precio unitario de un producto
  updateProductStock(id_products: string, newStock: number, newUnitPrice: number): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.PRODUCT_URL}/${id_products}`, { stock: newStock, unit_price: newUnitPrice })
      .pipe(catchError(error => this.handleError('Error al actualizar stock y precio del producto', error)));
  }

  // 🔹 Editar producto (actualizar múltiples campos)
  editProduct(id: string, updatedFields: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.PRODUCT_URL}/${id}`, updatedFields)
      .pipe(catchError(error => this.handleError('Error al editar el producto', error)));
  }

  // 🛑 Manejo de errores personalizado
  private handleError(operation: string, error: HttpErrorResponse) {
    console.error(`${operation}:`, error);
    let errorMsg = `${operation}: Ocurrió un error inesperado`;

    if (error.error instanceof ErrorEvent) {
      errorMsg = `${operation}: Error del cliente - ${error.error.message}`;
    } else {
      errorMsg = `${operation}: ${error.error?.message || 'Error desconocido en el servidor'}`;
    }
    
    return throwError(() => new Error(errorMsg));
  }
}