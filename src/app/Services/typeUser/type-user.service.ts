import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserType } from '../../models/userType';

@Injectable({
  providedIn: 'root'
})
export class TypeUserService {
  private TYPEUSER_URL = environment.TYPEUSER_URL;

  constructor(private http: HttpClient) {}

  createTypeUser(data: UserType): Observable<any> {
    return this.http.post(`${this.TYPEUSER_URL}`, data)
      .pipe(catchError(this.handleError));
  }

  getAllTypeUsers(): Observable<UserType[]> {
    return this.http.get<UserType[]>(this.TYPEUSER_URL)
      .pipe(catchError(this.handleError));
  }

  getTypeUserById(id_userType: number): Observable<UserType> {
    return this.http.get<UserType>(`${this.TYPEUSER_URL}/${id_userType}`)
      .pipe(catchError(this.handleError));
  }

  getTypeUserByName(rol: string): Observable<UserType[]> {
    return this.http.get<UserType[]>(`${this.TYPEUSER_URL}/search/${rol}`)
      .pipe(catchError(this.handleError));
  }

  editTypeUser(id_userType: number, rol: string): Observable<any> {
    return this.http.put(`${this.TYPEUSER_URL}/${id_userType}`, { rol })
      .pipe(catchError(this.handleError));
  }

  /** 🛑 Esta función realmente solo cambia el estado de "active", no elimina */
  toggleActiveStatus(id_userType: number): Observable<any> {
    return this.http.delete(`${this.TYPEUSER_URL}/${id_userType}`)
      .pipe(catchError(this.handleError));
  }

  /** 🔴 Manejo de errores HTTP */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error inesperado';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
