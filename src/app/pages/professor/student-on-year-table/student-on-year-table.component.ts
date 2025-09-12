import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentOnYear } from '../../../model/student-on-year.model';
import { PageResponse, StudentOnYearService } from '../../../services/student-on-year.service';

@Component({
  selector: 'app-student-on-year-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-on-year-table.component.html',
  styleUrls: ['./student-on-year-table.component.css']
})
export class StudentOnYearTableComponent implements OnInit {
  students: StudentOnYear[] = [];
  totalElements = 0;
  totalPages = 0;
  page = 0;
  size = 10;

  filters = {
    name: '',
    surname: '',
    index: '',
    enrollmentYear: undefined as number | undefined,
    studyYear: undefined as number | undefined,
    minAverageGrade: undefined as number | undefined,
    maxAverageGrade: undefined as number | undefined
  };

  loading = false;
  error?: string;

  constructor(private studentService: StudentOnYearService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = undefined;
    const token = localStorage.getItem('token') ?? '';

    this.studentService.searchStudents(token, this.page, this.size, this.filters).subscribe({
      next: (res: PageResponse<StudentOnYear>) => {
        this.students = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
        this.page = res.number;
        this.size = res.size;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load students';
        console.error(err);
        this.loading = false;
      },
    });
  }

  search(): void {
    this.page = 0; 
    this.load();
  }

  clearFilters(): void {
    this.filters = {
      name: '',
      surname: '',
      index: '',
      enrollmentYear: undefined,
      studyYear: undefined,
      minAverageGrade: undefined,
      maxAverageGrade: undefined
    };
    this.page = 0;
    this.load();
  }

  changePage(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.page = newPage;
      this.load();
    }
  }
}
