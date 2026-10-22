import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantPermissionsComponent } from './tenant-permissions.component';

describe('TenantPermissionsComponent', () => {
  let component: TenantPermissionsComponent;
  let fixture: ComponentFixture<TenantPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantPermissionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantPermissionsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
