// src/app/pages/admin/admin-university/admin-university.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { University } from '../../../model/university.model';
import { UniversityService } from '../../../services/university.service';

@Component({
  selector: 'app-admin-university',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-university.component.html',
  styleUrls: ['./admin-university.component.css']
})
export class AdminUniversityComponent implements OnInit {
  university: University | null = null;
  loading = true;
  error: string | null = null;
  editableUniversity: University = {} as University;

  constructor(private universityService: UniversityService) {}

  ngOnInit(): void {
    this.loadUniversityData();
  }

  loadUniversityData(): void {
    const id = '1';
    this.loading = true;
    this.error = null;

    this.universityService.getById(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (university) => {
          this.university = university;
          this.editableUniversity = { ...university }; 
        },
        error: (error) => {
          this.handleError('Failed to load university data.');
          console.error('Error loading university:', error);
        },
      });
  }

  onSaveClick(): void {
    if (!this.editableUniversity.id) {
      this.handleError('University ID is missing.');
      return;
    }
    this.loading = true;
    this.error = null;

    this.universityService.updateUniversity(this.editableUniversity)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (updatedUniversity) => {
          this.university = updatedUniversity;
          this.editableUniversity = { ...updatedUniversity };
          console.log('University updated successfully!'); 
        },
        error: (error) => {
          this.handleError('Failed to update university data. ' + error.message);
          console.error('Update error:', error);
        }
      });
  }

  // ✨ NEW FUNCTION: Correctly handles date changes
  onDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value) {
      this.editableUniversity.dateOfEstablishment = new Date(target.value);
    } else {
      this.editableUniversity.dateOfEstablishment = null;
    }
  }
  
  private handleError(message: string): void {
    this.error = message;
    this.loading = false;
    this.university = null;
  }
}