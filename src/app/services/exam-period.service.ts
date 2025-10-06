import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExamPeriod } from '../model/exam.model';

@Injectable({ providedIn: 'root' })
export class ExamPeriodService {
  private apiUrl = 'http://localhost:8080/api/exam_periods';

  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getAllPeriods(token: string): Observable<ExamPeriod[]> {
    return this.http.get<ExamPeriod[]>(this.apiUrl, this.headers(token));
  }
}