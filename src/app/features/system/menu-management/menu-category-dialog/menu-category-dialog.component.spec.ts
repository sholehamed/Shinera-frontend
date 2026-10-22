import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCategoryDialogComponent } from './menu-category-dialog.component';

describe('MenuCategoryDialogComponent', () => {
  let component: MenuCategoryDialogComponent;
  let fixture: ComponentFixture<MenuCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuCategoryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuCategoryDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
