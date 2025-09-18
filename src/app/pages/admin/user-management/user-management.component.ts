import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { User, UserType } from '../../../model/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  errorMessage: string | null = null;
  selectedUser: User | null = null;
  
  userTypes = Object.values(UserType);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getAllUsers(token).subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load users. ' + error.message;
          console.error('There was an error!', error);
        },
      });
    } else {
      this.errorMessage = 'Authentication token not found.';
    }
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
  }

  saveUser(): void {
    if (this.selectedUser) {
      const token = localStorage.getItem('token');
      if (token) {
        this.userService.updateUser(token, this.selectedUser).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              this.users[index] = updatedUser;
            }
            this.selectedUser = null;
            this.loadUsers();
          },
          error: (error) => {
            this.errorMessage = 'Failed to update user. ' + error.message;
            console.error('Update error!', error);
          },
        });
      }
    }
  }

  cancelEdit(): void {
    this.selectedUser = null;
  }

  deleteUser(id: number | undefined): void {
    if (id === undefined) {
      return;
    }
    
    const token = localStorage.getItem('token');
    if (token && confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(token, id).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== id);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete user. ' + error.message;
          console.error('Delete error!', error);
        },
      });
    }
  }
}