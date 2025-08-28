import { Component, OnInit } from '@angular/core';
import {  UniversityService } from '../../services/university.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {  FacultyService } from '../../services/faculty.service';
import { University } from '../../model/university.model';
import { Faculty } from '../../model/faculty.model';

@Component({
  selector: 'app-university',
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.css'],
  imports: [CommonModule, RouterModule],
})
export class UniversityComponent implements OnInit {
  university: University | null = null;
  faculties: Faculty[] = [];

constructor(
  private universityService: UniversityService,
  private facultyService: FacultyService,
  private route: ActivatedRoute
) {}

ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');

  if (id) {
    this.universityService.getById(id).subscribe(data => {
      this.university = data;

      this.facultyService.getByUniversityId(id).subscribe(faculties => {
        this.faculties = faculties;
      });
    });
  }
}

}
