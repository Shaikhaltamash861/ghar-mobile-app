import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterPropertyPage } from './filter-property.page';

describe('FilterPropertyPage', () => {
  let component: FilterPropertyPage;
  let fixture: ComponentFixture<FilterPropertyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPropertyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
