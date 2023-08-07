import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { RatesAndCode } from '../rates-and-code';

@Injectable({
  providedIn: 'root'
})


export class RateService {
  rates!:RatesAndCode[]
  
  constructor(private base: BaseService) { 

   

   this.base.getCoupons().subscribe((coupons)=>{
    coupons.forEach(x=>{
      this.rates.push({id:x.id, rates:x.rate})
    })  
    return this.rates
    })
  }
}
