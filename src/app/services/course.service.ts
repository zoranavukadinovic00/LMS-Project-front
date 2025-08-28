import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Course } from '../model/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8080/api/courses';

  constructor(private http: HttpClient) {}

   getById(id: number | string): Observable<Course | null> {
     return this.http.get<Course>(`${this.apiUrl}/${id}`);
   }

   getByStudyProgramId(studyProgramId: number | string): Observable<Course[]> {
     return this.http.get<Course[]>(`${this.apiUrl}/studyProgram/${studyProgramId}`);
   }

   getStudentCourses(token: string): Observable<Course[]> {

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<Course[]>(`${this.apiUrl}/student`,{ headers });
  }
}


