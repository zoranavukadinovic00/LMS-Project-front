import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SifarnikManagementComponent } from './sifarnik-management.component';

describe('SifarnikManagementComponent', () => {
  let component: SifarnikManagementComponent;
  let fixture: ComponentFixture<SifarnikManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SifarnikManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SifarnikManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
