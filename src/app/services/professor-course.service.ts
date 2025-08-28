import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfessorCourse } from '../model/professor-course.model';


@Injectable({
  providedIn: 'root',
})
export class ProfessorCourseService {
  private apiUrl = 'http://localhost:8080/api/professor_courses';

  constructor(private http: HttpClient) {}

  getByToken(token: string): Observable<ProfessorCourse[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.get<ProfessorCourse[]>(`${this.apiUrl}/professor_assigned_courses`, { headers });
  }

  
}