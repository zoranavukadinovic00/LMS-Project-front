import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

const API_URL = 'http://localhost:8080/api/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
     return this.http.post(`${API_URL}/login`, credentials);
  }

  

  signup(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${API_URL}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  saveTokenAndRole(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
