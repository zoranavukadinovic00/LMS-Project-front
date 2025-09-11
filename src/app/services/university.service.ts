import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { University } from '../model/university.model';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  private apiUrl = 'http://localhost:8080/api/universities';

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<University> {
    if (!id || id.trim() === '') {
      return throwError(() => new Error('University ID is required'));
    }

    return this.http.get<University>(`${this.apiUrl}/${id}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getAll(): Observable<University[]> {
    return this.http.get<University[]>(this.apiUrl).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request - please check your input';
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
