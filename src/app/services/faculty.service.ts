import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Faculty } from '../model/faculty.model';

@Injectable({
  providedIn: 'root',
})
export class FacultyService {
  private apiUrl = 'http://localhost:8080/api/faculties';

  constructor(private http: HttpClient) {}

  /** Get a single faculty by ID */
  getById(id: string): Observable<Faculty> {
    if (!id || id.trim() === '') {
      return throwError(() => new Error('Faculty ID is required'));
    }
    if (!/^\d+$/.test(id)) {
      return throwError(() => new Error('Invalid faculty ID'));
    }

    return this.http.get<Faculty>(`${this.apiUrl}/${id}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** Get all faculties */
  getAll(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.apiUrl).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** Get faculties for a specific university (for public “faculty pages” lists) */
  getByUniversityId(universityId: number | string): Observable<Faculty[]> {
    const id = String(universityId);
    if (!id || id.trim() === '') {
      return throwError(() => new Error('University ID is required'));
    }
    if (!/^\d+$/.test(id)) {
      return throwError(() => new Error('Invalid university ID'));
    }

    return this.http.get<Faculty[]>(`${this.apiUrl}/by_university/${id}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /** Centralized error handler (same pattern as UniversityService) */
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
          errorMessage = 'Faculty not found';
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

    console.error('FacultyService error:', error);
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      originalError: error,
    }));
  }
}
