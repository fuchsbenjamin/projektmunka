import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  newCouponClose = new EventEmitter<void>();

  constructor() { }

  newCouponCloseClick(): void {
    this.newCouponClose.emit();
  }
}
