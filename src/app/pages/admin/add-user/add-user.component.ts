import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import { RegisterRequest } from '../../../model/register-request.model';
import { UserType } from '../../../model/user.model'; 

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  newUser: RegisterRequest = {
    username: '',
    password: '',
    email: '',
    name: '',
    surname: '',
    biography: '', 
    type: UserType.PROFESSOR
  };
  userTypes = Object.values(UserType);
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private userService: UserService) {}

  onAddUser(): void {
    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Greška autentifikacije: Token nije pronađen.';
      this.loading = false;
      return;
    }

    this.userService.createUser(token, this.newUser)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.successMessage = 'Korisnik uspešno dodat!';
          this.resetForm();
        },
        error: (error) => {
          this.errorMessage = 'Greška prilikom dodavanja korisnika: ' + error.message;
          console.error('Error adding user:', error);
        }
      });
  }

  private resetForm(): void {
    this.newUser = {
      username: '',
      password: '',
      email: '',
      name: '',
      surname: '',
      biography: '', 
      type: UserType.PROFESSOR
    };
  }
}