import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Shopping } from '../../models/shoppings';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  private SHOPPING_URL = environment.SHOPPING_URL;

  constructor(private http: HttpClient) {}

 // 🔹 Obtener todas las compras
  getAllShoppings(): Observable<Shopping[]> {
    return this.http.get<Shopping[]>(`${this.SHOPPING_URL}`)
      .pipe(catchError(error => this.handleError('Error al obtener compras', error)));
  }

  // 🔹 Obtener una compra por ID
  getShoppingById(id: number): Observable<Shopping> {
    return this.http.get<Shopping>(`${this.SHOPPING_URL}/${id}`)
      .pipe(catchError(error => this.handleError('Error al obtener la compra', error)));
  }

  // 🔹 Crear una nueva compra
  createShopping(shoppingData: Shopping): Observable<ApiResponse<Shopping>> {
    return this.http.post<ApiResponse<Shopping>>(`${this.SHOPPING_URL}`, shoppingData)
      .pipe(catchError(error => this.handleError('Error al crear la compra', error)));
  }

  // 🔹 Editar una compra existente
  editShopping(id: number, shoppingData: Partial<Shopping>): Observable<ApiResponse<Shopping>> {
    return this.http.put<ApiResponse<Shopping>>(`${this.SHOPPING_URL}/${id}`, shoppingData)
      .pipe(catchError(error => this.handleError('Error al editar la compra', error)));
  }

  // 🔹 Eliminar una compra (deshabilitar lógicamente o eliminar permanentemente)
  deleteShopping(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.SHOPPING_URL}/${id}`)
      .pipe(catchError(error => this.handleError('Error al eliminar la compra', error)));
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


/* [
  this.shoppingService.getAllShoppings().subscribe({
  next: (shoppings) => {
    this.shoppingsList = shoppings;
  },
  error: (error) => {
    console.error("Error al obtener las compras:", error.message);
  }
});

this.shoppingService.getShoppingById(1).subscribe({
  next: (shopping) => {
    console.log("Compra obtenida:", shopping);
  },
  error: (error) => {
    console.error("Error al obtener la compra:", error.message);
  }
});

const updatedData = { payment_method: "Tarjeta" };

this.shoppingService.editShopping(1, updatedData).subscribe({
  next: (response) => {
    console.log(response.message);
  },
  error: (error) => {
    console.error("Error al editar la compra:", error.message);
  }
});

this.shoppingService.deleteShopping(1).subscribe({
  next: (response) => {
    console.log(response.message);
  },
  error: (error) => {
    console.error("Error al eliminar la compra:", error.message);
  }
});

]
 */