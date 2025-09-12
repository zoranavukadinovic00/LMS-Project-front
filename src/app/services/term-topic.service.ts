import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TermTopic } from '../model/term-topic.model';

@Injectable({
  providedIn: 'root',
})
export class TermTopicService {
  private apiUrl = 'http://localhost:8080/api/term-topics';

  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  
  getByCourse(token: string, courseId: number): Observable<TermTopic[]> {
    return this.http.get<TermTopic[]>(
      `${this.apiUrl}/by_course/${courseId}`,
      this.headers(token)
    );
  }

  
  createTermTopic(token: string, payload: TermTopic): Observable<TermTopic> {
    return this.http.post<TermTopic>(
      `${this.apiUrl}`,
      payload,
      this.headers(token)
    );
  }

  
  updateTermTopic(token: string, payload: TermTopic): Observable<TermTopic> {
    return this.http.put<TermTopic>(
      `${this.apiUrl}/${payload.id}`,
      payload,
      this.headers(token)
    );
  }

 
  deleteTermTopic(token: string, id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      this.headers(token)
    );
  }
}
