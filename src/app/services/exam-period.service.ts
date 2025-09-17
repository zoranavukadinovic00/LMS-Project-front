
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamPeriod } from '../model/exam.model';


const API_BASE = '/api';

@Injectable({ providedIn: 'root' })
export class ExamPeriodService {
  private baseUrl = `${API_BASE}/exam-periods`;

  constructor(private http: HttpClient) {}

  private authHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
  }

  getAll(token: string): Observable<ExamPeriod[]> {
    return this.http.get<ExamPeriod[]>(this.baseUrl, this.authHeaders(token));
  }

  getOne(token: string, id: number): Observable<ExamPeriod> {
    return this.http.get<ExamPeriod>(`${this.baseUrl}/${id}`, this.authHeaders(token));
  }

  create(token: string, payload: ExamPeriod): Observable<ExamPeriod> {
    return this.http.post<ExamPeriod>(this.baseUrl, payload, this.authHeaders(token));
  }

  update(token: string, id: number, payload: ExamPeriod): Observable<ExamPeriod> {
    return this.http.put<ExamPeriod>(`${this.baseUrl}/${id}`, payload, this.authHeaders(token));
  }

  deleteExamPeriod(token: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.authHeaders(token));
  }
}
