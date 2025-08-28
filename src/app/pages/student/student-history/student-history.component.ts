import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  StudentCourseService } from '../../../services/student-course.service';
import { StudentCourse } from '../../../model/student-course.model';

@Component({
  selector: 'app-student-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-history.component.html',
  styleUrls: ['./student-history.component.css']
})
export class StudentHistoryComponent implements OnInit {

  studentHistory: StudentCourse[] = [];

  constructor(private studentHistoryService: StudentCourseService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.studentHistoryService.getStudentPassedCoursesByToken(token).subscribe(data => {
        this.studentHistory = data;
      });
    }
  }
}


