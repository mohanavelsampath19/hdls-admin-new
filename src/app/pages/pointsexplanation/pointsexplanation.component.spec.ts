import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsexplanationComponent } from './pointsexplanation.component';

describe('PointsexplanationComponent', () => {
  let component: PointsexplanationComponent;
  let fixture: ComponentFixture<PointsexplanationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointsexplanationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointsexplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
