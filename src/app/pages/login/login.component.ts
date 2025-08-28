// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // adjust path if needed

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html', // assumes you save the HTML in login.component.html
  styleUrls: ['./login.component.css'], // optional
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      // email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { username, password } = this.form.value;

      this.auth.login({ username, password }).subscribe({
        next: (res) => {
          if (res.token) {
            this.auth.saveTokenAndRole(res.token, res.role);
            this.router.navigate(['/my-profile']).then(() => {
              window.location.reload();
            });
          }
        },
        error: (err) => {
          alert('Login failed. Please check your credentials.');
          console.error(err);
        },
      });
    }
  }
}
