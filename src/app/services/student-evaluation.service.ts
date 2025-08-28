import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { StudentEvaluation } from '../model/student-evaluation.model';



@Injectable({
  providedIn: 'root'
})
export class StudentEvaluationService {

  private apiUrl = 'http://localhost:8080/api/student-evaluations';  // adjust your backend URL here

  constructor(private http: HttpClient) {}

  getByToken(token: string): Observable<StudentEvaluation[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<StudentEvaluation[]>(`${this.apiUrl}/me`, { headers });
  }
}
