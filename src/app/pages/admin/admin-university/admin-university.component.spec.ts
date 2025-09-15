import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUniversityComponent } from './admin-university.component';

describe('AdminUniversityComponent', () => {
  let component: AdminUniversityComponent;
  let fixture: ComponentFixture<AdminUniversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUniversityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
