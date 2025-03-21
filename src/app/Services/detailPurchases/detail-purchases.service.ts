import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { DetailPurchase } from '../../models/detailPurchases';

@Injectable({
  providedIn: 'root'
})
export class DetailPurchasesService {

  private readonly DETAIL_PURCHASES_URL = environment.DETAIL_PURCHASES_URL;

  constructor(private http: HttpClient) { }

  /** Obtiene todos los detalles de compras */
  getAllDetails(): Observable<DetailPurchase[]> {
    return this.http.get<DetailPurchase[]>(this.DETAIL_PURCHASES_URL).pipe(
      catchError(this.handleError('fetching all detail purchases'))
    );
  }

  /** Obtiene un detalle de compra por ID */
  getDetailById(id: number): Observable<DetailPurchase> {
    return this.http.get<DetailPurchase>(`${this.DETAIL_PURCHASES_URL}/${id}`).pipe(
      catchError(this.handleError(`fetching detail purchase by ID: ${id}`))
    );
  }

  /** Obtiene los detalles de una compra por ID de compra */
  getDetailsByPurchaseId(id_purchases: number): Observable<DetailPurchase[]> {
    return this.http.get<DetailPurchase[]>(`${this.DETAIL_PURCHASES_URL}?id_purchases=${id_purchases}`).pipe(
      catchError(this.handleError(`fetching details by purchase ID: ${id_purchases}`))
    );
  }

  /** Crea un nuevo detalle de compra */
  createDetail(data: Partial<DetailPurchase>): Observable<DetailPurchase> {
    return this.http.post<DetailPurchase>(this.DETAIL_PURCHASES_URL, data).pipe(
      catchError(this.handleError('creating detail purchase'))
    );
  }

  /** Edita un detalle de compra */
  editDetail(id: number, data: Partial<DetailPurchase>): Observable<DetailPurchase> {
    return this.http.put<DetailPurchase>(`${this.DETAIL_PURCHASES_URL}/${id}`, data).pipe(
      catchError(this.handleError(`editing detail purchase with ID: ${id}`))
    );
  }

  /** Elimina un detalle de compra */
  deleteDetail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.DETAIL_PURCHASES_URL}/${id}`).pipe(
      catchError(this.handleError(`deleting detail purchase with ID: ${id}`))
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