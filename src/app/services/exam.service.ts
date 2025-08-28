import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Exam, ExamPeriod } from '../model/exam.model';


@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:8080/api/courses';

  constructor(private http: HttpClient) {}

  // --- MOCK DATA ---
  private mockPeriods: ExamPeriod[] = [
    { id: 1, name: 'April 2025' },
    { id: 2, name: 'July 2025' },
    { id: 3, name: 'September 1 2025' }
  ];

  private mockExams: Exam[] = [
    { id: 101, courseName: 'Mathematics 1', price: 50 },
    { id: 102, courseName: 'Physics 1', price: 40 },
    { id: 103, courseName: 'Computer Science Basics', price: 60 }
  ];

  getExamPeriods(token: string): Observable<ExamPeriod[]> {
      
     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
     return this.http.get<ExamPeriod[]>(`${this.apiUrl}/exam-periods`, { headers });
  }

  getAvailableExams(token: string, periodId: number): Observable<Exam[]> {
      
     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
     return this.http.get<Exam[]>(`${this.apiUrl}/exams?periodId=${periodId}`, { headers });
  }

  registerExams(token: string, examIds: number[]): Observable<any> {
      
     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
     return this.http.post(`${this.apiUrl}/register-exams`, { examIds }, { headers });
  }
}
