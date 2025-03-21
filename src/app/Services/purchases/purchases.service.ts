import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Purchase } from '../../models/purchases';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  private PURCHASES_URL = environment.PURCHASES_URL;

   constructor(private http: HttpClient) {}

  /** Obtiene todas las compras */
  getAllPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.PURCHASES_URL).pipe(
      catchError(error => this.handleError('Error al obtener todas las compras', error))
    );
  }

  /** Obtiene una compra por ID */
  getPurchaseById(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.PURCHASES_URL}/${id}`).pipe(
      catchError(error => this.handleError(`Error al obtener la compra con ID ${id}`, error))
    );
  }

  /** Crea una nueva compra */
  createPurchase(data: Purchase): Observable<Purchase> {
    return this.http.post<Purchase>(this.PURCHASES_URL, data).pipe(
      catchError(error => this.handleError('Error al crear una compra', error))
    );
  }

  /** Edita una compra existente */
  editPurchase(id: number, data: Partial<Purchase>): Observable<Purchase> {
    return this.http.put<Purchase>(`${this.PURCHASES_URL}/${id}`, data).pipe(
      catchError(error => this.handleError(`Error al editar la compra con ID ${id}`, error))
    );
  }

  /** Elimina una compra por ID */
  deletePurchase(id: number): Observable<void> {
    return this.http.delete<void>(`${this.PURCHASES_URL}/${id}`).pipe(
      catchError(error => this.handleError(`Error al eliminar la compra con ID ${id}`, error))
    );
  }

  /** Manejo de errores centralizado */
  private handleError(message: string, error: any) {
    console.error(message, error);
    return throwError(() => new Error(`${message}: ${error.message || error.statusText}`));
  }
}