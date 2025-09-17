import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudyProgram } from '../../../model/study-program.model';
import { Faculty } from '../../../model/faculty.model';
import { User } from '../../../model/user.model';
import { StudyProgramService } from '../../../services/study-program.service';
import { FacultyService } from '../../../services/faculty.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-study-program-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './study-program-management.component.html',
  styleUrls: ['./study-program-management.component.css']
})
export class StudyProgramManagementComponent implements OnInit {
  studyPrograms: StudyProgram[] = [];
  faculties: Faculty[] = [];
  users: User[] = [];
  selectedProgram: StudyProgram | null = null;
  errorMessage: string | null = null;
  selectedFacultyId: number | null = null;
  selectedManagerId: number | null = null;

  constructor(
    private studyProgramService: StudyProgramService,
    private facultyService: FacultyService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadStudyPrograms();
    this.loadFaculties();
    this.loadUsers();
  }

  loadStudyPrograms(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Authentication token not found.';
      console.error('Authentication token not found.');
      return;
    }
    
    this.studyProgramService.getAllStudyPrograms(token).subscribe({
      next: (data: StudyProgram[]) => {
        this.studyPrograms = data;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load study programs. ' + error.message;
        console.error('Failed to load study programs:', error);
      }
    });
  }

  loadFaculties(): void {
    this.facultyService.getAll().subscribe({
      next: (data) => {
        this.faculties = data;
      },
      error: (error) => {
        console.error('Failed to load faculties:', error);
      }
    });
  }

  loadUsers(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getAllUsers(token).subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (error) => {
          console.error('Failed to load users:', error);
        }
      });
    }
  }

  addProgram(): void {
    this.selectedProgram = {
      id: 0,
      name: '',
      facultyId: 0,
      facultyName: '',
      description: '',
      managerId: 0,
      managerName: '',
      managerSurname: '',
      managerEmail: ''
    };
    this.selectedFacultyId = null;
    this.selectedManagerId = null;
  }

  editProgram(program: StudyProgram): void {
    this.selectedProgram = { ...program };
    this.selectedFacultyId = program.facultyId;
    this.selectedManagerId = program.managerId;
  }

  saveProgram(): void {
    if (this.selectedProgram) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.errorMessage = 'Authentication token not found.';
        console.error('Authentication token not found.');
        return;
      }
      
      if (this.selectedFacultyId) {
        this.selectedProgram.facultyId = this.selectedFacultyId;
      }
      if (this.selectedManagerId) {
        this.selectedProgram.managerId = this.selectedManagerId;
      }

      if (this.selectedProgram.id === 0) {
        if (!this.selectedProgram.facultyId || !this.selectedProgram.managerId) {
          this.errorMessage = 'Please select a faculty and a manager.';
          return;
        }

        this.studyProgramService.createStudyProgram(this.selectedProgram, token).subscribe({
          next: () => {
            this.loadData();
            this.selectedProgram = null;
          },
          error: (error) => {
            this.errorMessage = 'Failed to create study program. ' + error.message;
            console.error('Creation error!', error);
          }
        });
      } else {
        this.studyProgramService.updateStudyProgram(this.selectedProgram, token).subscribe({
          next: () => {
            this.loadData();
            this.selectedProgram = null;
          },
          error: (error) => {
            this.errorMessage = 'Failed to update study program. ' + error.message;
            console.error('Update error!', error);
          }
        });
      }
    }
  }

  cancelEdit(): void {
    this.selectedProgram = null;
  }

  deleteProgram(id: number): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Authentication token not found.';
      console.error('Authentication token not found.');
      return;
    }

    if (confirm('Are you sure you want to delete this study program?')) {
      this.studyProgramService.deleteStudyProgram(id, token).subscribe({
        next: () => {
          this.loadStudyPrograms();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete study program. ' + error.message;
          console.error('Delete error!', error);
        }
      });
    }
  }
}