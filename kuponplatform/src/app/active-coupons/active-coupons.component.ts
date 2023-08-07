import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BaseService } from '../services/base.service';
import { Order } from '../order';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-active-coupons',
  templateUrl: './active-coupons.component.html',
  styleUrls: ['./active-coupons.component.css']
})
export class ActiveCouponsComponent implements OnInit {

  loggedInUid:any
  activeCoupons: Order[] = [];

  constructor(private auth: AuthService, private base: BaseService, private _bottomSheetRef: MatBottomSheetRef<ActiveCouponsComponent>) {
    this.auth.currentUid.subscribe((uid)=>{
      this.loggedInUid = uid;
    })
    this.base.getOrders().subscribe((orders)=>{
      this.activeCoupons = []
      orders.forEach(x=>{
        if(x.userUid == this.loggedInUid){this.activeCoupons.push(x), console.log(this.activeCoupons)}
      })
    })
   }

  ngOnInit(): void {
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  cancelOrder(ac:Order){
    this.base.cancelOrder(ac.code)
  }

}
