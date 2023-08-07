import { Pipe, PipeTransform } from '@angular/core';
import { Coupon } from './coupon';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(coupons: Coupon[], searchText: string): Coupon[] {
    if (!coupons || coupons.length === 0 || !searchText) {
      return coupons;
    }

    searchText = searchText.toLowerCase();

    return coupons.filter(coupon => {
      return coupon.includes.toLowerCase().includes(searchText);
    });
  }

}
