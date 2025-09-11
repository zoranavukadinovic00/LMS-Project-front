import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfessorCourseService } from '../../../services/professor-course.service';
import { CourseDetails } from '../../../model/course-details.model';
import { CourseService } from '../../../services/course.service';
import { StudentCourse } from '../../../model/student-course.model';
import { StudentCourseService } from '../../../services/student-course.service';


@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'] 
})
export class CourseDetailsComponent implements OnInit {
  courseId!: number;
  c?: CourseDetails;

  students: StudentCourse[] = []; 
  loading = false;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private studentCourseService: StudentCourseService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = undefined;

    const token = localStorage.getItem('token') ?? '';

    
    this.courseService.getCourseDetails(token, this.courseId).subscribe({
      next: (res) => { 
        this.c = res; 
        this.loading = false; 
        this.loadStudents(token); 
      },
      error: (err) => { 
        this.error = err?.error?.message || 'Error while loading course data.'; 
        this.loading = false; 
      }
    });
  }

  loadStudents(token: string): void {
    this.studentCourseService.getStudentsByCourse(this.courseId, token).subscribe({
      next: (res) => { this.students = res; },
      error: (err) => { console.error('Error loading students:', err); }
    });
  }

 
}
