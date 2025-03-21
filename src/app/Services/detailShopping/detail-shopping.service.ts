import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { DetailShoppings } from '../../models/detailShoppings';

@Injectable({
  providedIn: 'root'
})
export class DetailShoppingService {

  private readonly DETAIL_SHOPPING_URL = environment.DETAIL_SHOPPING_URL;

  constructor(private http: HttpClient) { }

  /** Obtiene todos los detalles de compras */
  getAllDetails(): Observable<DetailShoppings[]> {
    return this.http.get<DetailShoppings[]>(this.DETAIL_SHOPPING_URL).pipe(
      catchError(this.handleError('fetching all shopping details'))
    );
  }

  /** Obtiene un detalle de compra por su ID */
  getDetailById(id: string): Observable<DetailShoppings> {
    return this.http.get<DetailShoppings>(`${this.DETAIL_SHOPPING_URL}/${id}`).pipe(
      catchError(this.handleError(`fetching detail shopping by ID: ${id}`))
    );
  }

  /** Obtiene los detalles de una compra por ID de compra */
  getDetailsByShoppingId(id_shopping: number): Observable<DetailShoppings[]> {
    return this.http.get<DetailShoppings[]>(`${this.DETAIL_SHOPPING_URL}?id_shopping=${id_shopping}`).pipe(
      catchError(this.handleError(`fetching details by shopping ID: ${id_shopping}`))
    );
  }

  /** Crea un nuevo detalle de compra */
  createDetail(data: Partial<DetailShoppings>): Observable<DetailShoppings> {
    return this.http.post<DetailShoppings>(this.DETAIL_SHOPPING_URL, data).pipe(
      catchError(this.handleError('creating detail shopping'))
    );
  }

  /** Edita un detalle de compra */
  editDetail(id: string, data: Partial<DetailShoppings>): Observable<DetailShoppings> {
    return this.http.put<DetailShoppings>(`${this.DETAIL_SHOPPING_URL}/${id}`, data).pipe(
      catchError(this.handleError(`editing detail shopping with ID: ${id}`))
    );
  }

  /** Elimina un detalle de compra */
  deleteDetail(id: string): Observable<void> {
    return this.http.delete<void>(`${this.DETAIL_SHOPPING_URL}/${id}`).pipe(
      catchError(this.handleError(`deleting detail shopping with ID: ${id}`))
    );
  }

  /** Método privado para manejar errores y centralizar logs */
  private handleError(operation: string) {
    return (error: any) => {
      console.error(`Error ${operation}`, error);
      return throwError(() => new Error(`Error ${operation}`));
    };
  }
}
