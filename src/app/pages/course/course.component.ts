import { Component, OnInit } from '@angular/core';
import {  CourseService } from '../../services/course.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Course } from '../../model/course.model';

@Component({
  selector: 'app-course',
  imports: [CommonModule, RouterModule],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit{
  course: Course | null = null;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseService.getById(id).subscribe((course) => {
        this.course = course;

      });
    }
  }
}
