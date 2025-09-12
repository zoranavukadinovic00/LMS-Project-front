import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentOnYear } from '../model/student-on-year.model';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;   
  size: number;     
}

@Injectable({
  providedIn: 'root',
})
export class StudentOnYearService {
  private apiUrl = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient) {}

  searchStudents(
    token: string,
    page: number,
    size: number,
    filters: {
      name?: string;
      surname?: string;
      index?: string;
      enrollmentYear?: number;
      studyYear?: number;
      minAverageGrade?: number;
      maxAverageGrade?: number;
    }
  ): Observable<PageResponse<StudentOnYear>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (filters.name) params = params.set('name', filters.name);
    if (filters.surname) params = params.set('surname', filters.surname);
    if (filters.index) params = params.set('index', filters.index);
    if (filters.enrollmentYear) params = params.set('enrollmentYear', filters.enrollmentYear.toString());
    if (filters.studyYear) params = params.set('studyYear', filters.studyYear.toString());
    if (filters.minAverageGrade) params = params.set('minAverageGrade', filters.minAverageGrade.toString());
    if (filters.maxAverageGrade) params = params.set('maxAverageGrade', filters.maxAverageGrade.toString());

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<PageResponse<StudentOnYear>>(`${this.apiUrl}/search`, {
      headers,
      params,
    });
  }
}
