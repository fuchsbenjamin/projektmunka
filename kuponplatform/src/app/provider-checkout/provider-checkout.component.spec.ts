import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderCheckoutComponent } from './provider-checkout.component';

describe('ProviderCheckoutComponent', () => {
  let component: ProviderCheckoutComponent;
  let fixture: ComponentFixture<ProviderCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderCheckoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
