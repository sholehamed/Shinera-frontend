import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantSettingsComponent } from './tenant-settings.component';

describe('TenantSettingsComponent', () => {
  let component: TenantSettingsComponent;
  let fixture: ComponentFixture<TenantSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantSettingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
