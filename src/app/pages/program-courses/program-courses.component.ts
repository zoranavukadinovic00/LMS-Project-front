import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FacultyProgramsService } from '../../services/faculty-programs.service';
import { StudyProgramService } from '../../services/study-program.service';
import { Course } from '../../model/course.model';
import { StudyProgram } from '../../model/study-program.model';
import { CourseService } from '../../services/course.service';
import { SyllabusService } from '../../services/syllabus.service';
import { Syllabus } from '../../model/syllabus.model';

@Component({
  selector: 'app-program-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './program-courses.component.html',
  styleUrls: ['./program-courses.component.css']
})
export class ProgramCoursesComponent implements OnInit {
  studyProgram: StudyProgram | null = null;
  courses: Course[] = [];
  loading = true;
  error: string | null = null;
  programName = '';
  expandedCourseId: number | null = null;
  syllabuses: Syllabus[] = [];
  syllabusLoading = false;

  constructor(
    private route: ActivatedRoute, 
    private cs: CourseService,
    private studyProgramService: StudyProgramService,
    private syllabusService: SyllabusService
  ) {}

  ngOnInit(): void {
    const programId = this.route.snapshot.paramMap.get('programId');
    this.programName = this.route.snapshot.queryParamMap.get('name') || '';
    
    if (!programId) { 
      this.error = 'Program ID is missing.'; 
      this.loading = false; 
      return; 
    }

    // Load study program details
    this.studyProgramService.getById(programId).subscribe({
      next: (program) => {
        this.studyProgram = program;
        // Use program name from the loaded data if not provided via query params
        if (!this.programName && program) {
          this.programName = program.name;
        }
        
        // Load courses for this program
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
      },
      error: () => {
        this.error = 'Failed to load study program details.';
        this.loading = false;
      }
    });
  }

  toggleCourse(courseId: number): void {
    if (this.expandedCourseId === courseId) {
      // Collapse if same course is clicked
      this.expandedCourseId = null;
      this.syllabuses = [];
    } else {
      // Expand different course
      this.expandedCourseId = courseId;
      this.syllabusLoading = true;
      
      this.syllabusService.getSyllabusByCourse(courseId).subscribe({
        next: (syllabuses) => {
          this.syllabuses = syllabuses || [];
          this.syllabusLoading = false;
        },
        error: () => {
          this.syllabuses = [];
          this.syllabusLoading = false;
        }
      });
    }
  }
}