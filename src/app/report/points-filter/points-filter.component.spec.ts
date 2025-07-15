import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsFilterComponent } from './points-filter.component';

describe('PointsFilterComponent', () => {
  let component: PointsFilterComponent;
  let fixture: ComponentFixture<PointsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointsFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
