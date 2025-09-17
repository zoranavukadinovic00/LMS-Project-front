// src/app/services/user.service.ts

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
  private adminApiUrl = 'http://localhost:8080/api/admin/users';
  // ✨ Dodata putanja za autentifikacioni API
  private authApiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  // ✨ Novi metod za kreiranje korisnika
  createUser(token: string, userData: RegisterRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.authApiUrl}/register`, userData, { headers }).pipe(
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

  // Metode za administraciju
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
      errorMessage = `Error ${error.status}: ${error.error?.message || error.statusText}`;
    }
    console.error('UserService error:', error);
    return throwError(() => new Error(errorMessage));
  }
}