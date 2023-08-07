import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderNewCouponComponent } from './provider-new-coupon.component';

describe('ProviderNewCouponComponent', () => {
  let component: ProviderNewCouponComponent;
  let fixture: ComponentFixture<ProviderNewCouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderNewCouponComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderNewCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
