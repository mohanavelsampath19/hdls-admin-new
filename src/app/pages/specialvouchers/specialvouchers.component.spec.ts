import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialvouchersComponent } from './specialvouchers.component';

describe('SpecialvouchersComponent', () => {
  let component: SpecialvouchersComponent;
  let fixture: ComponentFixture<SpecialvouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialvouchersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialvouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
