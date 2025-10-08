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
  

  constructor(
    private studyProgramService: StudyProgramService,
    private facultyService: FacultyService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }
  
  // Pomoćna funkcija za resetovanje grešaka
  clearError(): void {
      this.errorMessage = null;
  }

  loadData(): void {
    this.clearError();
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
        this.errorMessage = 'Failed to load study programs: ' + (error.userMessage || error.message);
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
    console.log("LOG: Function addProgram() called. Opening form to create NEW program.");
    this.clearError();
    
    this.selectedProgram = {
      id: 0, // ID 0 signalizira KREIRANJE
      name: '',
      facultyId: null as any, 
      facultyName: '',
      description: '',
      managerId: null as any, 
      managerName: '',
      managerSurname: '',
      managerEmail: ''
    };
  }

  editProgram(program: StudyProgram): void {
    this.clearError();
    this.selectedProgram = { ...program };
  }

  saveProgram(): void {
    if (this.selectedProgram) {
      
      const isNew = this.selectedProgram.id === 0;
      console.log(`LOG: Attempting to save program. Mode: ${isNew ? 'CREATE' : 'UPDATE'}`);
      
      this.clearError();
      const token = localStorage.getItem('token');
      if (!token) {
        this.errorMessage = 'Authentication token not found.';
        console.error('Authentication token not found.');
        return;
      }
      
      let facultyIdToSend: number | null = null;
      if (this.selectedProgram.facultyId) {
          facultyIdToSend = Number(this.selectedProgram.facultyId);
          if (isNaN(facultyIdToSend) || facultyIdToSend === 0) {
              facultyIdToSend = null;
          }
      }

      let managerIdToSend: number | null = null;
      if (this.selectedProgram.managerId) {
          managerIdToSend = Number(this.selectedProgram.managerId);
          if (isNaN(managerIdToSend) || managerIdToSend === 0) {
              managerIdToSend = null;
          }
      }
      
      const programToSend = {
          ...this.selectedProgram,
          facultyId: facultyIdToSend,
          managerId: managerIdToSend
      };


      if (isNew) {
        // Logika za kreiranje
        if (!programToSend.facultyId || !programToSend.managerId) {
          this.errorMessage = 'Molimo Vas da odaberete Fakultet i Menadžera pre slanja.';
          return;
        }

        console.log("LOG: Sending Create Request with DTO:", programToSend);
        this.studyProgramService.createStudyProgram(programToSend as StudyProgram, token).subscribe({
          next: () => {
            console.log("LOG: Study Program successfully created.");
            this.loadData();
            this.selectedProgram = null;
          },
          error: (error) => {
            this.errorMessage = `Creation failed. ${error.userMessage || 'Unknown server error.'}`; 
            console.error('Creation error!', error);
          }
        });
      } else {
        // Logika za ažuriranje
        this.studyProgramService.updateStudyProgram(programToSend as StudyProgram, token).subscribe({
          next: () => {
            this.loadData();
            this.selectedProgram = null;
          },
          error: (error) => {
            this.errorMessage = `Update failed. ${error.userMessage || 'Unknown server error.'}`;
            console.error('Update error!', error);
          }
        });
      }
    }
  }

  cancelEdit(): void {
    this.clearError(); 
    this.selectedProgram = null;
    console.log("LOG: Edit/Create cancelled. Form closed."); 
  }
  
  deleteProgram(id: number): void {
    this.clearError();
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
          this.errorMessage = `Failed to delete study program. ${error.userMessage || 'Unknown error.'}`;
          console.error('Delete error!', error);
        }
      });
    }
  }
}