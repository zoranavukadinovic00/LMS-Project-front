import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  private adminApiUrl = 'http://localhost:8080/api/admin/users'; // Dodata nova putanja

  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getUserByToken(token: string): Observable<User> {
    return this.http.get<User>(this.apiUrl + '/my-profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  update(token: string, user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${user.id}`, user, this.headers(token));
  }

  // Metode za administraciju
  getAllUsers(token: string): Observable<User[]> {
    return this.http.get<User[]>(this.adminApiUrl, this.headers(token));
  }

  updateUser(token: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.adminApiUrl}/${user.id}`, user, this.headers(token));
  }

  deleteUser(token: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${id}`, this.headers(token));
  }
}