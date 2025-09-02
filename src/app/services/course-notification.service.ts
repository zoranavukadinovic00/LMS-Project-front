import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CourseNotification } from '../model/course-notification.model';

@Injectable({
  providedIn: 'root',
})
export class CourseNotificationService {
  private apiUrl = 'http://localhost:8080/api/course_notifications';

  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getByToken(token: string): Observable<CourseNotification[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.get<CourseNotification[]>(`${this.apiUrl}/studentNotifications`, { headers });
  }
  getProfessorByToken(token: string): Observable<CourseNotification[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<CourseNotification[]>(`${this.apiUrl}/professorNotifications`, { headers });
}

 getNotificationsByCourse(token: string, courseId: number): Observable<CourseNotification[]> {
    return this.http.get<CourseNotification[]>(
      `${this.apiUrl}/by_course/${courseId}`,
      this.headers(token)
    );
  }
  
  createNotification(
    token: string,
    payload: CourseNotification
  ): Observable<CourseNotification> {
    return this.http.post<CourseNotification>(
      `${this.apiUrl}`,
      payload,
      this.headers(token)
    );
  }

  
  updateNotification(token: string, payload: CourseNotification): Observable<CourseNotification> {
    return this.http.put<CourseNotification>(
      `${this.apiUrl}/${payload.id}`,
      payload,
      this.headers(token)
    );
  }

 
  deleteNotification(token: string, id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      this.headers(token)
    );
  }

  
  getByCourse(token: string, courseId: number): Observable<CourseNotification[]> {
    return this.http.get<CourseNotification[]>(
      `${this.apiUrl}/by_course/${courseId}`,
      this.headers(token)
    );
  }
}