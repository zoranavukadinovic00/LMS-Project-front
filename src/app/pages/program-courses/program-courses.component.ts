import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacultyProgramsService } from '../../services/faculty-programs.service';
import { Course } from '../../model/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-program-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './program-courses.component.html',
  styleUrls: ['./program-courses.component.css']
})
export class ProgramCoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  error: string | null = null;
  programName = '';

  constructor(private route: ActivatedRoute, private cs: CourseService) {}

  ngOnInit(): void {
    const programId = this.route.snapshot.paramMap.get('programId');
    this.programName = this.route.snapshot.queryParamMap.get('name') || '';
    if (!programId) { this.error = 'Program ID is missing.'; this.loading = false; return; }

    this.cs.getByStudyProgramId(programId).subscribe({
      next: data => {
        this.courses = data ?? []; 
        this.loading = false; 
      },

      error: () => { 
        this.error = 'Failed to load courses.';
        this.loading = false; 
      }
    });
  }
}
