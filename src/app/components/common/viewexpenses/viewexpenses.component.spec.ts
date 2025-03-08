import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewexpensesComponent } from './viewexpenses.component';

describe('ViewexpensesComponent', () => {
  let component: ViewexpensesComponent;
  let fixture: ComponentFixture<ViewexpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewexpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewexpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
