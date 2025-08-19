import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipDetailsListComponent } from './membership-details-list.component';

describe('MembershipDetailsListComponent', () => {
  let component: MembershipDetailsListComponent;
  let fixture: ComponentFixture<MembershipDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembershipDetailsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
