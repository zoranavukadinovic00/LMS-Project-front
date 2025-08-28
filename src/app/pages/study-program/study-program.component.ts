import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  
  StudyProgramService,
} from '../../services/study-program.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {  CourseService } from '../../services/course.service';
import { StudyProgram } from '../../model/study-program.model';
import { Course } from '../../model/course.model';

@Component({
  selector: 'app-study-program',
  imports: [CommonModule, RouterModule],
  templateUrl: './study-program.component.html',
  styleUrls: ['./study-program.component.css'],
})
export class StudyProgramComponent implements OnInit {
  studyProgram: StudyProgram | null = null;
  courses: Course[] = [];

  constructor(
    private route: ActivatedRoute,
    private studyProgramService: StudyProgramService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.studyProgramService.getById(id).subscribe((program) => {
        this.studyProgram = program;
        this.courseService.getByStudyProgramId(id).subscribe((courses) => {
          this.courses = courses;
        });
      });
    }
  }
}
