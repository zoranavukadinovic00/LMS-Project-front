import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyProgramManagementComponent } from './study-program-management.component';

describe('StudyProgramManagementComponent', () => {
  let component: StudyProgramManagementComponent;
  let fixture: ComponentFixture<StudyProgramManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyProgramManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyProgramManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
