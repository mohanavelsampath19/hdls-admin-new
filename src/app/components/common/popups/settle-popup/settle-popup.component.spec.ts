import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlePopupComponent } from './settle-popup.component';

describe('SettlePopupComponent', () => {
  let component: SettlePopupComponent;
  let fixture: ComponentFixture<SettlePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettlePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
