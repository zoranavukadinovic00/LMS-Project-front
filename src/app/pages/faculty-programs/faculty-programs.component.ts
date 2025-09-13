import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FacultyProgramsService } from '../../services/faculty-programs.service';
import { StudyProgram } from '../../model/study-program.model';

@Component({
  selector: 'app-faculty-programs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faculty-programs.component.html',
  styleUrls: ['./faculty-programs.component.css']
})
export class FacultyProgramsComponent implements OnInit {
  programs: StudyProgram[] = [];
  facultyName = '';
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private programsSvc: FacultyProgramsService
  ) {}

  ngOnInit(): void {
    const facultyId = this.route.snapshot.paramMap.get('id');
    if (!facultyId) { this.error = 'Faculty ID is missing.'; this.loading = false; return; }

    this.programsSvc.listByFaculty(facultyId).subscribe({
      next: data => {
        this.programs = data ?? [];
        this.facultyName = this.programs[0]?.facultyName ?? '';
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load study programs.'; this.loading = false; }
    });
  }
}
