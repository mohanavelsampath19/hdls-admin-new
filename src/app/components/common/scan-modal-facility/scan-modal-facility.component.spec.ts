import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanModalFacilityComponent } from './scan-modal-facility.component';

describe('ScanModalComponent', () => {
  let component: ScanModalFacilityComponent;
  let fixture: ComponentFixture<ScanModalFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanModalFacilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanModalFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
