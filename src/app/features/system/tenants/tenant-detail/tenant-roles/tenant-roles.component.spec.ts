import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantRolesComponent } from './tenant-roles.component';

describe('TenantRolesComponent', () => {
  let component: TenantRolesComponent;
  let fixture: ComponentFixture<TenantRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantRolesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantRolesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
