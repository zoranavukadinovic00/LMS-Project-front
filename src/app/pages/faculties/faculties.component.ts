import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Faculties } from '../../model/faculties.model';
import { FacultiesService } from '../../services/faculties.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faculties',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.css']
})
export class FacultiesComponent implements OnInit {
  faculties: Faculties[] = [];
  loading = false;
  error = '';

  constructor(private facultiesService: FacultiesService) {}

  ngOnInit(): void {

    
    this.loading = true;
    this.facultiesService.getAll().subscribe({
      next: (list) => { this.faculties = list ?? []; this.loading = false; },
      error: () => { this.error = 'Ne mogu da učitam fakultete.'; this.loading = false; }
    });
  }
}
