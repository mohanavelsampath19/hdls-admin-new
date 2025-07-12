import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelOrderSummaryComponent } from './hotel-order-summary.component';

describe('HotelOrderSummaryComponent', () => {
  let component: HotelOrderSummaryComponent;
  let fixture: ComponentFixture<HotelOrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelOrderSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
