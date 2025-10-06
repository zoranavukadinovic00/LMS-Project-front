import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExamGrade } from '../model/exam-grade.model';


@Injectable({ providedIn: 'root' })
export class ExamGradeService {
  private apiUrl = 'http://localhost:8080/api/exam-grades';

  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  addGrade(token: string, studentId: number, courseId: number, termId: number, grade: number): Observable<ExamGrade> {
    const body = {
      studentId: studentId,
      courseId: courseId,
      termId: termId,
      grade: grade
    };
    return this.http.post<ExamGrade>(this.apiUrl, body, this.headers(token));
  }

  getGradesByCourse(token: string, courseId: number): Observable<ExamGrade[]> {
    return this.http.get<ExamGrade[]>(`${this.apiUrl}/course/${courseId}`, this.headers(token));
  }

  getMyCourseGrades(token: string): Observable<ExamGrade[]> {
    return this.http.get<ExamGrade[]>(`${this.apiUrl}/my-courses`, this.headers(token));
  }
}