import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../model/user.model';
import { RegisterRequest } from '../model/register-request.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  // Ovo je ispravna ruta za administratorske operacije kreiranja/ažuriranja/brisanja
  private adminApiUrl = 'http://localhost:8080/api/admin/users';
  private authApiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  // FIX 1: Promenjena metoda da koristi ispravan adminApiUrl za kreiranje korisnika
  adminCreateUser(token: string, userData: RegisterRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Post zahtev ide na /api/admin/users
    return this.http.post<any>(this.adminApiUrl, userData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  getUserByToken(token: string): Observable<User> {
    return this.http.get<User>(this.apiUrl + '/my-profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  update(token: string, user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${user.id}`, user, this.headers(token));
  }

  getAllUsers(token: string): Observable<User[]> {
    return this.http.get<User[]>(this.adminApiUrl, this.headers(token));
  }

  updateUser(token: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.adminApiUrl}/${user.id}`, user, this.headers(token));
  }

  deleteUser(token: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`, this.headers(token));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Poboljšana poruka za grešku, uključujući status
      const message = typeof error.error === 'string' ? error.error : (error.error?.message || error.statusText);
      errorMessage = `Greška ${error.status}: ${message}`;
    }
    console.error('UserService error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
