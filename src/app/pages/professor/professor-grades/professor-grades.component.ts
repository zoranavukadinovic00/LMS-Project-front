import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ExamTerm } from '../../../model/exam-term.model';
import { ExamApplication } from '../../../model/exam-application.model';
import { ExamTermService } from '../../../services/exam-term.service';
import { ExamApplicationService } from '../../../services/exam-application.service';

@Component({
  selector: 'app-professor-grades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './professor-grades.component.html',
  styleUrls: ['./professor-grades.component.css']
})
export class ProfessorGradesComponent implements OnInit {
  courseId!: number;
  courseName: string = '';
  
  examTerms: ExamTerm[] = [];
  selectedTermId?: number;
  selectedTerm?: ExamTerm;
  
  studentApplications: ExamApplication[] = [];
  gradesMap: Map<number, number> = new Map(); // applicationId -> grade
  
  message = '';
  errorMessage = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private examTermService: ExamTermService,
    private examApplicationService: ExamApplicationService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.courseName = this.route.snapshot.queryParamMap.get('name') || '';
    this.loadExamTerms();
  }

  loadExamTerms(): void {
    const token = localStorage.getItem('token') ?? '';
    this.examTermService.getAllTerms(token).subscribe({
      next: (terms) => {
        this.examTerms = terms.filter(t => t.courseId === this.courseId);
      },
      error: (err) => {
        console.error('Error loading terms:', err);
        this.errorMessage = 'Failed to load exam terms';
      }
    });
  }

  onTermSelected(): void {
    if (!this.selectedTermId) {
      this.studentApplications = [];
      this.selectedTerm = undefined;
      return;
    }
    
    this.selectedTerm = this.examTerms.find(t => t.id === this.selectedTermId);
    
    if (!this.isWithinGradingPeriod()) {
      this.errorMessage = 'Grading period has expired (must be within 15 days after exam date)';
      this.studentApplications = [];
      return;
    }
    
    this.loadStudentApplications();
  }

  isWithinGradingPeriod(): boolean {
    if (!this.selectedTerm) return false;
    
    const examDate = new Date(this.selectedTerm.examDate);
    const today = new Date();
    const diffTime = today.getTime() - examDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= 15;
  }

  loadStudentApplications(): void {
    const token = localStorage.getItem('token') ?? '';
    this.loading = true;
    this.errorMessage = '';
    
    this.examApplicationService.getApplicationsByTerm(token, this.selectedTermId!).subscribe({
      next: (applications) => {
        this.studentApplications = applications;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading applications:', err);
        this.errorMessage = 'Failed to load student applications';
        this.loading = false;
      }
    });
  }

  submitGrade(application: ExamApplication): void {
    const grade = this.gradesMap.get(application.id);
    
    if (!grade || grade < 5 || grade > 10) {
      this.errorMessage = 'Grade must be between 5 and 10';
      return;
    }

    if (application.status === 'GRADED') {
      this.errorMessage = 'This student has already been graded';
      return;
    }

    this.loading = true;
    const token = localStorage.getItem('token') ?? '';

    this.examApplicationService.submitGrade(token, application.id, grade).subscribe({
      next: () => {
        this.message = `Grade ${grade} submitted successfully for ${application.studentName}`;
        this.errorMessage = '';
        this.loading = false;
        
        // Ažuriraj status
        application.status = 'GRADED';
        this.gradesMap.delete(application.id);
        
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.error('Error submitting grade:', err);
        this.errorMessage = err.error || 'Failed to submit grade';
        this.loading = false;
      }
    });
  }

  setGrade(applicationId: number, value: string): void {
    const grade = parseInt(value);
    if (grade >= 5 && grade <= 10) {
      this.gradesMap.set(applicationId, grade);
    } else {
      this.gradesMap.delete(applicationId);
    }
  }

  getGrade(applicationId: number): number | undefined {
    return this.gradesMap.get(applicationId);
  }
}