import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StudentCourse } from '../../model/student-course.model';
import { ExamTerm } from '../../model/exam-term.model';
import { ExamPeriod } from '../../model/exam.model';
import { StudentCourseService } from '../../services/student-course.service';
import { ExamTermService } from '../../services/exam-term.service';
import { ExamPeriodService } from '../../services/exam-period.service';
import { ExamApplicationService } from '../../services/exam-application.service';

interface CourseWithTerms {
  course: StudentCourse;
  availableTerms: ExamTerm[];
}

@Component({
  selector: 'app-exam-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-registration.component.html',
  styleUrls: ['./exam-registration.component.css']
})
export class ExamRegistrationComponent implements OnInit {
  examPeriods: ExamPeriod[] = [];
  selectedPeriodId?: number;
  
  myCourses: StudentCourse[] = [];
  allTerms: ExamTerm[] = [];
  coursesWithTerms: CourseWithTerms[] = [];
  
  selectedApplications: { courseName: string, termId: number }[] = [];
  
  message = '';
  errorMessage = '';
  loading = false;

  constructor(
    private studentCourseService: StudentCourseService,
    private examTermService: ExamTermService,
    private examPeriodService: ExamPeriodService,
    private examApplicationService: ExamApplicationService
  ) {}

  ngOnInit(): void {
    this.loadExamPeriods();
    this.loadMyCourses();
    this.loadAllTerms();
  }

  loadExamPeriods(): void {
    const token = localStorage.getItem('token') ?? '';
    this.examPeriodService.getAllPeriods(token).subscribe({
      next: (periods) => {
        this.examPeriods = periods.filter(p => this.isPeriodActive(p));
      },
      error: (err) => console.error('Error loading periods:', err)
    });
  }

  isPeriodActive(period: ExamPeriod): boolean {
    const now = new Date();
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    return now >= start && now <= end;
  }

  loadMyCourses(): void {
    const token = localStorage.getItem('token') ?? '';
    this.studentCourseService.getMyEnrolledCourses(token).subscribe({
      next: (courses) => {
        this.myCourses = courses;
        this.updateCoursesWithTerms();
      },
      error: (err) => console.error('Error loading courses:', err)
    });
  }

  loadAllTerms(): void {
    const token = localStorage.getItem('token') ?? '';
    this.examTermService.getAllTerms(token).subscribe({
      next: (terms) => {
        this.allTerms = terms;
        this.updateCoursesWithTerms();
      },
      error: (err) => console.error('Error loading terms:', err)
    });
  }

  onPeriodSelected(): void {
    this.updateCoursesWithTerms();
  }

  updateCoursesWithTerms(): void {
    if (!this.selectedPeriodId) {
      this.coursesWithTerms = [];
      return;
    }

    this.coursesWithTerms = this.myCourses.map(course => ({
      course,
      availableTerms: this.allTerms.filter(term => 
        term.courseName === course.courseName && 
        term.periodId === this.selectedPeriodId
      )
    })).filter(cwt => cwt.availableTerms.length > 0);
  }

  toggleTermSelection(courseName: string, termId: number): void {
    const index = this.selectedApplications.findIndex(
      app => app.courseName === courseName && app.termId === termId
    );

    if (index > -1) {
      this.selectedApplications.splice(index, 1);
    } else {
      const alreadySelectedForCourse = this.selectedApplications.find(
        app => app.courseName === courseName
      );
      if (alreadySelectedForCourse) {
        this.errorMessage = 'You can only select one term per course';
        return;
      }
      this.selectedApplications.push({ courseName, termId });
      this.errorMessage = '';
    }
  }

  isTermSelected(courseName: string, termId: number): boolean {
    return this.selectedApplications.some(
      app => app.courseName === courseName && app.termId === termId
    );
  }

  applyForExams(): void {
    if (this.selectedApplications.length === 0) {
      this.errorMessage = 'Please select at least one exam term';
      return;
    }

    this.loading = true;
    const token = localStorage.getItem('token') ?? '';
    let completed = 0;
    let errors = 0;

    this.selectedApplications.forEach(app => {
      this.examApplicationService.applyForExam(token, app.termId).subscribe({
        next: () => {
          completed++;
          if (completed + errors === this.selectedApplications.length) {
            this.handleApplicationComplete(errors);
          }
        },
        error: (err) => {
          errors++;
          console.error('Error applying:', err);
          if (completed + errors === this.selectedApplications.length) {
            this.handleApplicationComplete(errors);
          }
        }
      });
    });
  }

  handleApplicationComplete(errors: number): void {
    this.loading = false;
    if (errors === 0) {
      this.message = 'Successfully applied for all selected exams!';
      this.errorMessage = '';
      this.selectedApplications = [];
    } else {
      this.errorMessage = `Failed to apply for ${errors} exam(s). Check if you already applied.`;
      this.message = '';
    }
  }
}