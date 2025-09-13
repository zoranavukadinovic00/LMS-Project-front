import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Course } from '../model/course.model';
import { CourseDetails } from '../model/course-details.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8080/api/courses';

  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

   getById(id: number | string): Observable<Course | null> {
     return this.http.get<Course>(`${this.apiUrl}/${id}`);
   }

   getByStudyProgramId(studyProgramId: number | string): Observable<Course[]> {
     return this.http.get<Course[]>(`${this.apiUrl}/forStudyProgram/${studyProgramId}`);
   }

   getStudentCourses(token: string): Observable<Course[]> {

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<Course[]>(`${this.apiUrl}/student`,{ headers });
  }
  getCourseDetails(token: string, courseId: number): Observable<CourseDetails> {

    return this.http.get<CourseDetails>(`${this.apiUrl}/${courseId}`,this.headers(token));
  }

  getStudentsForCourse<TPage>(
    token: string,
    courseId: number,
    params?: { q?: string; page?: number; size?: number; sort?: string }
  ): Observable<TPage> {
    return this.http.get<TPage>(`${this.apiUrl}/${courseId}/students`,{ ...this.headers(token), params: params as any }
    );
  }
}


