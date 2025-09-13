import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudyProgram } from '../model/study-program.model';
import { Course } from '../model/course.model';

@Injectable({ providedIn: 'root' })
export class FacultyProgramsService {
  private base = 'http://localhost:8080/api/study_programs';

  constructor(private http: HttpClient) {}

  listByFaculty(facultyId: number | string): Observable<StudyProgram[]> {
    return this.http.get<StudyProgram[]>(`${this.base}/by_faculty/${facultyId}`);
  }
  
}
