import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Supplier } from '../../models/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private SUPPLIER_URL = environment.SUPPLIER_URL;

  constructor(private http: HttpClient) {}

  /** ✅ Crea un nuevo proveedor en la base de datos */
  createSuppliers(data: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.SUPPLIER_URL, data)
      .pipe(catchError(this.handleError));
  }

  /** ✅ Obtiene todos los proveedores */
  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.SUPPLIER_URL)
      .pipe(catchError(this.handleError));
  }

  /** ✅ Obtiene un proveedor por su ID */
  getSuppliersById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.SUPPLIER_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }


  /** ✅ Busca proveedores por nombre */
  getSuppliersByName(name: string): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.SUPPLIER_URL}?name=${name}`)
      .pipe(catchError(this.handleError));
  }

  /** 🔄 Actualiza los datos generales de un proveedor (nombre, dirección, etc.) */
  updateSupplier(id_suppliers: number, supplierData: Partial<Supplier>): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.SUPPLIER_URL}/${id_suppliers}`, supplierData)
      .pipe(catchError(this.handleError));
  }

  /** 🔄 Cambia solo el estado de un proveedor (activo/inactivo) */
  updateSupplierStatus(id_suppliers: number, active: boolean): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.SUPPLIER_URL}/${id_suppliers}`, { active })
      .pipe(catchError(this.handleError));
  }

  /** 🔴 Desactiva un proveedor (NO lo elimina, solo lo desactiva en el sistema) */
  deleteSupplier(id_suppliers: number): Observable<Supplier> {
    return this.http.delete<Supplier>(`${this.SUPPLIER_URL}/${id_suppliers}`)
      .pipe(catchError(this.handleError));
  }

  /** ❌ Elimina permanentemente un proveedor de la base de datos */
  destroySupplier(id_suppliers: number): Observable<Supplier> {
    return this.http.delete<Supplier>(`${this.SUPPLIER_URL}/destroy/${id_suppliers}`)
      .pipe(catchError(this.handleError));
  }

  /** 🔴 Método para manejar errores en las peticiones HTTP */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error ${error.status}: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
