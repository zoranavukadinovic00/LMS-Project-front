import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentCourse } from '../model/student-course.model';


@Injectable({
  providedIn: 'root',
})
export class StudentCourseService {
  private apiUrl = 'http://localhost:8080/api/student_courses';

  constructor(private http: HttpClient) {}

  getByToken(token: string): Observable<StudentCourse[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.get<StudentCourse[]>(`${this.apiUrl}/studentEnrolledCourses`, { headers });
  }

  getStudentPassedCoursesByToken(token: string): Observable<StudentCourse[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.get<StudentCourse[]>(`${this.apiUrl}/studentPassedCourses`, { headers });
  }
  getStudentsByCourse(courseId: number, token: string): Observable<StudentCourse[]> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.get<StudentCourse[]>(`${this.apiUrl}/studentsByCourse/${courseId}`, { headers });
}

}