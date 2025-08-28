import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EvaluationInstrument } from '../model/evaluation-instrument.model';



@Injectable({
  providedIn: 'root',
})
export class EvaluationInstrumentService {
  private apiUrl = 'http://localhost:8080/api/evaluation_instruments';

  constructor(private http: HttpClient) {}

  getEvaluationByCourse(token: string, courseId: number): Observable<EvaluationInstrument[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.get<EvaluationInstrument[]>(`${this.apiUrl}/by_course/${courseId}`, { headers });
  }

  
}