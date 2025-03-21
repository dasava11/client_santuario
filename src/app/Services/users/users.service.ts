import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../models/user'; 

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private USERS_URL = environment.USERS_URL;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.USERS_URL).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  getUserById(user_id: number): Observable<User> {
    return this.http.get<User>(`${this.USERS_URL}/${user_id}`).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  getUserByName(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.USERS_URL}`, { params: { username } }).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  createUser(data: User): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.USERS_URL, data).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  editUser(user_id: number, data: Partial<User>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.USERS_URL}/${user_id}`, data).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  toggleUserActive(user_id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.USERS_URL}/${user_id}/toggle-active`, {}).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  destroyUser(user_id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.USERS_URL}/${user_id}`).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  // Manejo de errores centralizado
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error ${error.status}: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
