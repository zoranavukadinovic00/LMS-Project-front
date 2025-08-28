import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../model/user.model';



@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/api/user'; // real API endpoint for later

  constructor(private http: HttpClient) {}

  getUserByToken(token: string): Observable<User> {
    // Real HTTP request example:
     return this.http.get<User>(this.apiUrl, {
       headers: { Authorization: `Bearer ${token}` }
     });

  }

  update(user: User): Observable<void> {
    // Here you would call your backend API to update the profile, e.g.:
     return this.http.put<void>(`${this.apiUrl}/${user.id}`, user);

    // Dummy delay and success response
    return of(void 0);
  }
}


