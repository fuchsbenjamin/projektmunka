import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveCouponsComponent } from './active-coupons.component';

describe('ActiveCouponsComponent', () => {
  let component: ActiveCouponsComponent;
  let fixture: ComponentFixture<ActiveCouponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveCouponsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
