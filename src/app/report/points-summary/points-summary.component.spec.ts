import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsSummary } from './points-summary.component';

describe('PointsSummaryComponent', () => {
  let component: PointsSummary;
  let fixture: ComponentFixture<PointsSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointsSummary ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
