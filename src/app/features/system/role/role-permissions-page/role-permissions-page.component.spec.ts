import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissionsPageComponent } from './role-permissions-page.component';

describe('RolePermissionsPageComponent', () => {
  let component: RolePermissionsPageComponent;
  let fixture: ComponentFixture<RolePermissionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePermissionsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RolePermissionsPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
