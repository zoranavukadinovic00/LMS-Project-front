import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getById(id: number | string): Observable<StudyProgram | null> {
    return this.http.get<StudyProgram>(`${this.apiUrl}/${id}`);
  }

  getByFacultyId(facultyId: number | string): Observable<StudyProgram[]> {
    return this.http.get<StudyProgram[]>(`${this.apiUrl}/faculty/${facultyId}`);
  }

  getAllStudyProgramsAsStaff(token: string): Observable<StudyProgram[]> {
    const headers = this.getAuthHeaders(token);
    return this.http.get<StudyProgram[]>(this.staffApiUrl, { headers: headers }).pipe(
      catchError(error => {
        console.error('Failed to get study programs for staff:', error);
        return throwError(() => new Error('Failed to load study programs. Please check your permissions.'));
      })
    );
  }

  getAllStudyPrograms(token: string): Observable<StudyProgram[]> {
    const headers = this.getAuthHeaders(token);
    return this.http.get<StudyProgram[]>(this.adminApiUrl, { headers: headers }).pipe(
      catchError(error => {
        console.error('Failed to get study programs:', error);
        return throwError(() => new Error('Failed to load study programs. Please check your permissions.'));
      })
    );
  }

  createStudyProgram(program: StudyProgram, token: string): Observable<StudyProgram> {
    const headers = this.getAuthHeaders(token);
    return this.http.post<StudyProgram>(this.adminApiUrl, program, { headers: headers }).pipe(
      catchError(error => {
        console.error('Failed to create study program:', error);
        return throwError(() => new Error('Failed to create study program.'));
      })
    );
  }

  updateStudyProgram(program: StudyProgram, token: string): Observable<StudyProgram> {
    const headers = this.getAuthHeaders(token);
    return this.http.put<StudyProgram>(`${this.adminApiUrl}/${program.id}`, program, { headers: headers }).pipe(
      catchError(error => {
        console.error('Failed to update study program:', error);
        return throwError(() => new Error('Failed to update study program.'));
      })
    );
  }

  deleteStudyProgram(id: number, token: string): Observable<void> {
    const headers = this.getAuthHeaders(token);
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`, { headers: headers }).pipe(
      catchError(error => {
        console.error('Failed to delete study program:', error);
        return throwError(() => new Error('Failed to delete study program.'));
      })
    );
  }
}