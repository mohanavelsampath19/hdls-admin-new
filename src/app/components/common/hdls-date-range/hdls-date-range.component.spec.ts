import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HdlsDateRangeComponent } from './hdls-date-range.component';

describe('HdlsDateRangeComponent', () => {
  let component: HdlsDateRangeComponent;
  let fixture: ComponentFixture<HdlsDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HdlsDateRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HdlsDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
