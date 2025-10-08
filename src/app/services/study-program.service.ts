import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StudyProgram } from '../model/study-program.model';

@Injectable({
  providedIn: 'root',
})
export class StudyProgramService {
  private apiUrl = 'http://localhost:8080/api/study-programs';
  private adminApiUrl = 'http://localhost:8080/api/admin/study-programs';
  private staffApiUrl = 'http://localhost:8080/api/staff/study-programs';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(token: string): HttpHeaders {
    if (!token) {
      throw new Error('Authentication token not found.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Pomoćna funkcija za obradu grešaka u servisu
  private handleError(error: HttpErrorResponse, operation = 'Operation') {
    let userMessage = `Something bad happened in ${operation}; please try again later.`;

    if (error.error instanceof ErrorEvent) {
      // Klijentska ili mreža greška
      console.error(`Client-side error in ${operation}:`, error.error.message);
      userMessage = `A network or client error occurred: ${error.error.message}`;
    } else {
      // Bekend vratio neuspešan kod
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
      
      if (error.status === 400) {
         // Iako je telo greške prazno u našem slučaju, možemo poslati bolju poruku.
         userMessage = `Error: Dependent entity not found or invalid data format. (Status 400)`;
      } else if (error.status === 500) {
         userMessage = `Error: Internal Server Error. Failed to save to database. (Status 500)`;
      } else {
         userMessage = `Server error ${error.status}: Failed to process request.`;
      }
    }
    // Vraćamo originalnu grešku, ali je obogaćujemo porukom za korisnika ako je moguće.
    return throwError(() => ({
        ...error,
        userMessage: userMessage
    }));
  }

  getById(id: number | string): Observable<StudyProgram | null> {
    return this.http.get<StudyProgram>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error, 'getById'))
    );
  }

  getByFacultyId(facultyId: number | string): Observable<StudyProgram[]> {
    return this.http.get<StudyProgram[]>(`${this.apiUrl}/faculty/${facultyId}`).pipe(
      catchError(error => this.handleError(error, 'getByFacultyId'))
    );
  }

  getAllStudyProgramsAsStaff(token: string): Observable<StudyProgram[]> {
    const headers = this.getAuthHeaders(token);
    return this.http.get<StudyProgram[]>(this.staffApiUrl, { headers: headers }).pipe(
      catchError(error => this.handleError(error, 'getAllStudyProgramsAsStaff'))
    );
  }

  getAllStudyPrograms(token: string): Observable<StudyProgram[]> {
    const headers = this.getAuthHeaders(token);
    return this.http.get<StudyProgram[]>(this.adminApiUrl, { headers: headers }).pipe(
      catchError(error => this.handleError(error, 'getAllStudyPrograms'))
    );
  }

  createStudyProgram(program: StudyProgram, token: string): Observable<StudyProgram> {
    const headers = this.getAuthHeaders(token);
    return this.http.post<StudyProgram>(this.adminApiUrl, program, { headers: headers }).pipe(
      catchError(error => this.handleError(error, 'createStudyProgram'))
    );
  }

  updateStudyProgram(program: StudyProgram, token: string): Observable<StudyProgram> {
    const headers = this.getAuthHeaders(token);
    return this.http.put<StudyProgram>(`${this.adminApiUrl}/${program.id}`, program, { headers: headers }).pipe(
      catchError(error => this.handleError(error, 'updateStudyProgram'))
    );
  }

  deleteStudyProgram(id: number, token: string): Observable<void> {
    const headers = this.getAuthHeaders(token);
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`, { headers: headers }).pipe(
      catchError(error => this.handleError(error, 'deleteStudyProgram'))
    );
  }
}
