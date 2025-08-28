import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EvaluationInstrument } from '../model/evaluation-instrument.model';
import { Syllabus } from '../model/syllabus.model';



@Injectable({
  providedIn: 'root',
})
export class SyllabusService {
  private apiUrl = 'http://localhost:8080/api/syllabuses';

  constructor(private http: HttpClient) {}

  getSyllabusByCourse(token: string, courseId: number): Observable<Syllabus[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.get<Syllabus[]>(`${this.apiUrl}/by_course/${courseId}`, { headers });
  }

  
}