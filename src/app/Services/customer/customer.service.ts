import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Customer } from '../../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly CUSTOMER_URL = environment.CUSTOMER_URL;

  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.CUSTOMER_URL)
      .pipe(catchError(this.handleError));
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.CUSTOMER_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getCustomerByName(name: string): Observable<Customer[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Customer[]>(this.CUSTOMER_URL, { params })
      .pipe(catchError(this.handleError));
  }

  createCustomer(data: Omit<Customer, 'id_customers'>): Observable<Customer> {
    return this.http.post<Customer>(this.CUSTOMER_URL, data)
      .pipe(catchError(this.handleError));
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.CUSTOMER_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  editCustomer(id: number, data: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.CUSTOMER_URL}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en la petición HTTP:', error);
    return throwError(() => new Error(error.message || 'Error en el servidor'));
  }
}
