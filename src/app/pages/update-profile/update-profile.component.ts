import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
})
export class UpdateProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  userId!: number; // store the ID here

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      jmbg: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      email: ['', [Validators.required, Validators.email]],
      biography: ['', [Validators.minLength(10), Validators.maxLength(1000)]],
    });

    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getUserByToken(token).subscribe((user: User) => {
        this.userId = user.id; // save the id
        this.profileForm.patchValue(user);
      });
    }
  }

  onSubmit(): void {
    
    this.successMessage = '';
    this.errorMessage = '';

    const token = localStorage.getItem('token');
    if (!token) return;

    if (this.profileForm.invalid) {
      this.errorMessage = 'Please fix the errors in the form.';
      return;
    }

    this.loading = true;

    // include the id in the payload
    const updatedProfile: User = {
      id: this.userId,
      ...this.profileForm.value,
    };

    this.userService.update(token, updatedProfile).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Profile updated successfully!';
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to update profile. Please try again.';
      },
    });
  }
}
