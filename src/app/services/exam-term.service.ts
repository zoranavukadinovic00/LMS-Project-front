import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExamTerm } from '../model/exam-term.model';

@Injectable({ providedIn: 'root' })
export class ExamTermService {
  private apiUrl = 'http://localhost:8080/api/exam_terms';

  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getAllTerms(token: string): Observable<ExamTerm[]> {
    return this.http.get<ExamTerm[]>(this.apiUrl, this.headers(token));
  }

  getTermsByCourse(token: string, courseId: number): Observable<ExamTerm[]> {
    return this.http.get<ExamTerm[]>(`${this.apiUrl}/course/${courseId}`, this.headers(token));
  }
}