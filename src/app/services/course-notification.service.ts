import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CourseNotification } from '../model/course-notification.model';

@Injectable({
  providedIn: 'root',
})
export class CourseNotificationService {
  private apiUrl = 'http://localhost:8080/api/course_notifications';

  constructor(private http: HttpClient) {}

  getByToken(token: string): Observable<CourseNotification[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.get<CourseNotification[]>(`${this.apiUrl}/studentNotifications`, { headers });
  }
}
