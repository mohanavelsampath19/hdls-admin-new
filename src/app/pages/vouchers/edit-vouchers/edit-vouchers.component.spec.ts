import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVouchersComponent } from './edit-vouchers.component';

describe('EditVouchersComponent', () => {
  let component: EditVouchersComponent;
  let fixture: ComponentFixture<EditVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVouchersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
