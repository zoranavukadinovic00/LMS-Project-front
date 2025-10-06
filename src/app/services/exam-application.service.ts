import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamApplication } from '../model/exam-application.model';

@Injectable({
  providedIn: 'root'
})
export class ExamApplicationService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // ISPRAVLJENO - samo token i termId
  applyForExam(token: string, termId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/exam_applications/apply?termId=${termId}`,
      {},
      this.getHeaders(token)
    );
  }

  getApplicationsByTerm(token: string, termId: number): Observable<ExamApplication[]> {
    return this.http.get<ExamApplication[]>(
      `${this.apiUrl}/exam_applications/term/${termId}`,
      this.getHeaders(token)
    );
  }

  submitGrade(token: string, applicationId: number, grade: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/exam-grades/grade-application/${applicationId}`,
      { grade },
      this.getHeaders(token)
    );
  }
}