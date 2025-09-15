import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators'; 

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MenuComponent implements OnInit {
  role: string | null = null;
  username: string | null = null;

  constructor(private router: Router) { }
  
  ngOnInit() {
    this.updateFromLocalStorage();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateFromLocalStorage();
    });
  }

  updateFromLocalStorage() {
    this.role = localStorage.getItem('role');
    this.username = localStorage.getItem('username');
  }

  logout() {
    localStorage.clear();
    window.location.reload();
  }
}