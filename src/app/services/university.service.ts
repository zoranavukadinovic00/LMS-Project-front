// src/app/services/university.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { University } from '../model/university.model';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  private apiUrl = 'http://localhost:8080/api/universities';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getById(id: string): Observable<University> {
    if (!id || id.trim() === '') {
      return throwError(() => new Error('University ID is required'));
    }

    return this.http.get<University>(`${this.apiUrl}/${id}`).pipe(
      retry(2),
      map((university: University) => {
        if (university.dateOfEstablishment) {
          university.dateOfEstablishment = new Date(university.dateOfEstablishment);
        }
        return university;
      }),
      catchError(this.handleError)
    );
  }

  getAll(): Observable<University[]> {
    return this.http.get<University[]>(this.apiUrl).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  updateUniversity(university: University): Observable<University> {
    const headers = this.getAuthHeaders();
    
    // ✨ ISPRAVLJENO: Proverava se da li je dateOfEstablishment validan pre konverzije
    const dateOfEstablishment = university.dateOfEstablishment instanceof Date 
        ? university.dateOfEstablishment.toISOString().substring(0, 10)
        : null;

    const universityToSend = {
      ...university,
      dateOfEstablishment: dateOfEstablishment // ✨ Koristimo novu validiranu vrednost
    };

    return this.http.put<University>(
      `${this.apiUrl}/${university.id}`, 
      universityToSend, 
      { headers: headers }
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request - please check your input';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'University not found';
          break;
        case 500:
          errorMessage = 'Server error - please try again later';
          break;
        case 0:
          errorMessage = 'No connection to the server';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    console.error('UniversityService error:', error);
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      originalError: error,
    }));
  }
}