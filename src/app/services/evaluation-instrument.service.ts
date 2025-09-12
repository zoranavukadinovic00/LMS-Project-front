
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EvaluationInstrument } from '../model/evaluation-instrument.model';

@Injectable({ providedIn: 'root' })
export class EvaluationInstrumentService {
    private apiUrl = 'http://localhost:8080/api/evaluation-instruments';


  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  createEvaluationInstrument(token: string, payload: EvaluationInstrument): Observable<EvaluationInstrument> {
    return this.http.post<EvaluationInstrument>(`${this.apiUrl}`, payload, this.headers(token));
  }

  updateEvaluationInstrument(token: string, payload: EvaluationInstrument): Observable<EvaluationInstrument> {
    return this.http.put<EvaluationInstrument>(`${this.apiUrl}/${payload.id}`, payload, this.headers(token));
  }

  deleteEvaluationInstrument(token: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.headers(token));
  }

  getByCourse(token: string, courseId: number): Observable<EvaluationInstrument[]> {
    return this.http.get<EvaluationInstrument[]>(`${this.apiUrl}/by_course/${courseId}`, this.headers(token));
  }
}
