import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantGroupsComponent } from './tenant-groups.component';

describe('TenantGroupsComponent', () => {
  let component: TenantGroupsComponent;
  let fixture: ComponentFixture<TenantGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantGroupsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantGroupsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
