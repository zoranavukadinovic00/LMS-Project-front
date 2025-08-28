import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [CommonModule, RouterModule]
})
export class MenuComponent implements OnInit {
  role: string | null = null;
  username: string | null = null;

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.username = localStorage.getItem('username');
  }

  logout() {
    localStorage.clear();
    window.location.reload();
  }
}
