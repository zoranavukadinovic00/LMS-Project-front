import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs'; // Dodat import za tap
import { ExamPeriod } from '../model/exam.model';

@Injectable({ providedIn: 'root' })
export class ExamPeriodService {
  private apiUrl = 'http://localhost:8080/api/exam_periods';

  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getAllPeriods(token: string): Observable<ExamPeriod[]> {
    return this.http.get<ExamPeriod[]>(this.apiUrl, this.headers(token)).pipe(
        // LOG F: Prikazuje šta je Angular primio
        tap(periods => {
            console.log('LOG F [Angular Service]: Received periods from backend:', periods); 
            if (periods.length === 0) {
                console.warn('UPOZORENJE: Backend je vratio praznu listu. Proverite sistemsko vreme servera!');
            }
        })
    );
  }
}