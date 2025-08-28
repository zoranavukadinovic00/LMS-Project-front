import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FacultyService } from '../../services/faculty.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  StudyProgramService,
} from '../../services/study-program.service';
import { Faculty } from '../../model/faculty.model';
import { StudyProgram } from '../../model/study-program.model';

@Component({
  selector: 'app-faculty',
  imports: [CommonModule, RouterModule],
  templateUrl: './faculty.component.html',
  styleUrl: './faculty.component.css',
})
export class FacultyComponent implements OnInit {
  faculty: Faculty | null = null;
  studyPrograms: StudyProgram[] = [];

  constructor(
    private facultyService: FacultyService,
    private route: ActivatedRoute,
    private studyProgramService: StudyProgramService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facultyService.getById(id).subscribe((data) => {
        this.faculty = data;
        this.studyProgramService
          .getByFacultyId(id)
          .subscribe((studyPrograms) => {
            this.studyPrograms = studyPrograms;
          });
      });
    }
  }
}
