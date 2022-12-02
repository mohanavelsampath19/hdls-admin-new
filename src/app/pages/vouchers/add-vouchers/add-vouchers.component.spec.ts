import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVouchersComponent } from './add-vouchers.component';

describe('AddVouchersComponent', () => {
  let component: AddVouchersComponent;
  let fixture: ComponentFixture<AddVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVouchersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
