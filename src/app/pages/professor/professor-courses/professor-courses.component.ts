import { Component, OnInit } from '@angular/core';
import { ProfessorCourse } from '../../../model/professor-course.model';
import { ProfessorCourseService } from '../../../services/professor-course.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profesor-courses',
    standalone: true,
  imports: [CommonModule],
  templateUrl: './professor-courses.component.html',
  styleUrl: './professor-courses.component.css'
})
export class ProfesorCoursesComponent implements OnInit {

  professorCourses: ProfessorCourse[] = [];
  
  constructor(private professorCourseService: ProfessorCourseService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.professorCourseService.getByToken(token).subscribe(data => {
        this.professorCourses = data;
      });
    }
  }



  openEvaluations(courseId: number): void {
    this.router.navigate(['/professor-evaluations', courseId]);
  }

  openNotifications(courseId: number): void {
    this.router.navigate(['professor-notifications', courseId]);
  }

  openSyllabus(courseId: number, courseName: string): void {
  this.router.navigate(['/professor-syllabus', courseId], { 
    state: { courseName } 
  });
}

}
