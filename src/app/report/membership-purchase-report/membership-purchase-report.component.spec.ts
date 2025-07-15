import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipPurchaseReportComponent } from './membership-purchase-report.component';

describe('MembershipPurchaseReportComponent', () => {
  let component: MembershipPurchaseReportComponent;
  let fixture: ComponentFixture<MembershipPurchaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipPurchaseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipPurchaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
