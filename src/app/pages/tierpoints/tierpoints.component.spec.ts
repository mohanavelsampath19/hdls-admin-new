import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TierpointsComponent } from './tierpoints.component';

describe('TierpointsComponent', () => {
  let component: TierpointsComponent;
  let fixture: ComponentFixture<TierpointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TierpointsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TierpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
