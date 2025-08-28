import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  StudentCourseService } from '../../../services/student-course.service';
import { StudentCourse } from '../../../model/student-course.model';

@Component({
  selector: 'app-student-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.css']
})
export class StudentCourseComponent implements OnInit {

  studentCourses: StudentCourse[] = [];

  constructor(private studentCourseService: StudentCourseService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.studentCourseService.getByToken(token).subscribe(data => {
        this.studentCourses = data;
      });
    }
  }
}

