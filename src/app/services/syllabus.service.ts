import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Syllabus } from '../model/syllabus.model';



@Injectable({
  providedIn: 'root',
})
export class SyllabusService {
  private apiUrl = 'http://localhost:8080/api/syllabuses';


  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getSyllabusByCourse(token: string, courseId: number): Observable<Syllabus[]> {
    return this.http.get<Syllabus[]>(
      `${this.apiUrl}/by_course/${courseId}`,
      this.headers(token)
    );
  }

  createSyllabus(token: string, payload: Syllabus): Observable<Syllabus> {
    return this.http.post<Syllabus>(`${this.apiUrl}`, payload, this.headers(token));
  }

  updateSyllabus(token: string, payload: Syllabus): Observable<Syllabus> {
    return this.http.put<Syllabus>(`${this.apiUrl}/${payload.id}`, payload, this.headers(token));
  }

  deleteSyllabus(token: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.headers(token));
  }
}