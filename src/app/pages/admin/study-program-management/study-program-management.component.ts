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
          // Filtrirajte korisnike na one koji mogu biti menadžeri ako je potrebno
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
    // Kreiranje plitke kopije
    this.selectedProgram = { ...program };
  }

  saveProgram(): void {
    if (this.selectedProgram) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.errorMessage = 'Authentication token not found.';
        console.error('Authentication token not found.');
        return;
      }
      
      // 🚨 KLJUČNA IZMENA: Osigurava da su ID-evi brojevi pre slanja.
      let facultyIdToSend: number | null = null;
      if (this.selectedProgram.facultyId) {
          facultyIdToSend = Number(this.selectedProgram.facultyId);
          // Postavi na null ako je 0 ili NaN (što može biti neizabrana opcija u padajućem meniju)
          if (isNaN(facultyIdToSend) || facultyIdToSend === 0) {
              facultyIdToSend = null;
          }
      }

      let managerIdToSend: number | null = null;
      if (this.selectedProgram.managerId) {
          managerIdToSend = Number(this.selectedProgram.managerId);
          // Postavi na null ako je 0 ili NaN
          if (isNaN(managerIdToSend) || managerIdToSend === 0) {
              managerIdToSend = null;
          }
      }
      
      // Kreiranje DTO objekta za slanje sa ispravnim tipovima (Number/Long)
      const programToSend = {
          ...this.selectedProgram,
          facultyId: facultyIdToSend,
          managerId: managerIdToSend
      };


      if (programToSend.id === 0) {
        // Logika za kreiranje
        if (!programToSend.facultyId || !programToSend.managerId) {
          this.errorMessage = 'Please select a faculty and a manager.';
          return;
        }

        // Šaljemo ispravno konvertovani objekat
        this.studyProgramService.createStudyProgram(programToSend as StudyProgram, token).subscribe({
          next: () => {
            this.loadData();
            this.selectedProgram = null;
            this.errorMessage = null; 
          },
          error: (error) => {
            this.errorMessage = 'Failed to create study program. Server responded: ' + (error.error?.message || error.message);
            console.error('Creation error!', error);
          }
        });
      } else {
        // Logika za ažuriranje
        // Šaljemo ispravno konvertovani objekat i za update
        this.studyProgramService.updateStudyProgram(programToSend as StudyProgram, token).subscribe({
          next: () => {
            this.loadData();
            this.selectedProgram = null;
            this.errorMessage = null;
          },
          error: (error) => {
            this.errorMessage = 'Failed to update study program. Server responded: ' + (error.error?.message || error.message);
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