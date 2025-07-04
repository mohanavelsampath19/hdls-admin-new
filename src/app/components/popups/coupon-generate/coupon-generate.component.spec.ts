import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponGenerateComponent } from './coupon-generate.component';

describe('CouponGenerateComponent', () => {
  let component: CouponGenerateComponent;
  let fixture: ComponentFixture<CouponGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponGenerateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
