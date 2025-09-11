import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../model/user.model';



@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; 

  constructor(private http: HttpClient) {}

  
  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getUserByToken(token: string): Observable<User> {
    
     return this.http.get<User>(this.apiUrl + '/my-profile', {
       headers: { Authorization: `Bearer ${token}` }
     });

  }

  update(token: string, user: User): Observable<void> {
     return this.http.put<void>(`${this.apiUrl}/${user.id}`, user, this.headers(token));

  }
}


