// src/app/pages/update-profile/update-profile.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // ✨ UVEZITE SVE POTREBNE KLASE
import { finalize } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // ✨ UMESTO FormsModule
  ],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  profileForm: FormGroup; // ✨ Nova property
  loading = true; // Uvek počinje sa true jer se podaci učitavaju
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // ✨ UVEZITE FormBuilder
  constructor(private fb: FormBuilder, private userService: UserService) {
    // ✨ INICIJALIZACIJA FORME SA VALIDATORIMA
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      jmbg: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      email: ['', [Validators.required, Validators.email]],
      biography: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserByToken(token)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (user) => {
            // ✨ POPUNJAVANJE FORME DOBIJENIM PODACIMA
            this.profileForm.patchValue({
              name: user.name,
              surname: user.surname,
              username: user.username,
              jmbg: user.jmbg,
              email: user.email,
              biography: user.biography
            });
          },
          error: (error) => {
            this.errorMessage = 'Failed to load user profile: ' + error.message;
            console.error(error);
          }
        });
    } else {
      this.errorMessage = 'Authentication token not found.';
      this.loading = false;
    }
  }

  // ✨ METODA ZA SLANJE FORME
  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Please fix the validation errors in the form.';
      return;
    }

    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const token = localStorage.getItem('token');
    const userFromForm = this.profileForm.value;

    if (token) {
      // Iz `User` modela koji učitavate na početku, uzimate ID.
      // Svi ostali podaci su iz forme.
      const userId = this.profileForm.get('id')?.value; // Pretpostavljam da imate i id u formi. Ako ne, koristite id iz user objekta sa početka.

      // Da biste izbegli grešku sa id-jem, najbolje je uzeti originalni user objekat i zameniti mu vrednosti
      // sa vrednostima iz forme pre slanja.
      this.userService.getUserByToken(token)
        .subscribe({
          next: (originalUser) => {
            // Kreirajte novi objekat sa ažuriranim podacima i originalnim ID-jem
            const updatedUser: User = {
              ...originalUser, // Kopirajte originalne podatke
              ...this.profileForm.value // Prepišite polja iz forme
            };

            this.userService.update(token, updatedUser)
              .pipe(finalize(() => this.loading = false))
              .subscribe({
                next: () => {
                  this.successMessage = 'Profile updated successfully!';
                },
                error: (error) => {
                  this.errorMessage = 'Failed to update profile: ' + error.message;
                  console.error(error);
                }
              });
          },
          error: (error) => {
            this.errorMessage = 'Failed to retrieve original user data.';
            console.error(error);
            this.loading = false;
          }
        });
    } else {
      this.errorMessage = 'Authentication token not found.';
      this.loading = false;
    }
  }
}