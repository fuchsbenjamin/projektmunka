import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { TagekService } from '../services/tagek.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatBottomSheet,MatBottomSheetModule,MatBottomSheetRef,} from '@angular/material/bottom-sheet';
import { MatCardModule} from '@angular/material/card';
import { BaseService } from '../services/base.service';
import { Coupon } from '../coupon';
import {MatSliderModule} from '@angular/material/slider';
import { Order } from '../order';
import { AuthService } from '../services/auth.service';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import { ActiveCouponsComponent } from '../active-coupons/active-coupons.component';
import { SearchPipe } from '../search.pipe';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  loggedInUid:any
  coupons: Coupon[] = [];
  filteredCoupons: Coupon[] = []
  selectedTags: string[] = [];
  tags:string[] = [];
  panelOpenState = false;
  showRateWindow = false;
  showShureWindow = false;
  selectedCoupon:number = NaN;
  currentCodes = [{code:'', index: NaN}]
  activeCode:any = ''
  isPayed = false

  activeCoupons:Order[] = []

  averageRates=[{id:'', rate:0}]
  rateSliderValue:number = 8;
  searchValue:string = ''
  

  constructor(private tagsService: TagekService, private base: BaseService, private auth: AuthService, private _bottomSheet: MatBottomSheet ) {
    this.tags = this.tagsService.tagek;
    this.activeCoupons = [];

    this.auth.currentUid.subscribe((uid)=>{
      this.loggedInUid = uid
    })

    this.base.getCoupons().subscribe((coupons)=>{
      this.coupons = [];
      coupons.forEach(x=>{
        this.coupons.push(x)
      })

      this.averageRates = [];
      this.base.averageRates.forEach(x=>{
        this.averageRates.push({id:x.id, rate: x.rate})
      })
    })

    this.base.getOrders().subscribe((orders)=>{
      this.activeCoupons = []
      orders.forEach(x=>{
        if(x.userUid == this.loggedInUid){this.activeCoupons.push(x), console.log(this.activeCoupons)}
      })
    })
    
    this.filteredCoupons = this.coupons;
   }


   ngOnInit(): void {
    this.base.getOrders().subscribe((orders: Order[]) => {
      orders.forEach(x=>{
        console.log(this.activeCode)
        if(x.code == this.activeCode && x.payed == true){this.isPayed = true; console.log(this.isPayed)};
      })
    });

    
  }

  openBottomSheet(): void {
    this._bottomSheet.open(ActiveCouponsComponent);
  }

  

  openRateWindow(i:number){

    this.showRateWindow = true;
    this.selectedCoupon = i
  }

  sendNewRate(i:number){
    const currentCouponId = this.coupons[i].couponId;
    this.base.addNewRate(this.rateSliderValue, currentCouponId)
    this.showRateWindow = false;
  }

  openShureWindow(i:number){

    this.showShureWindow = true;
    this.selectedCoupon = i
  }

  activateCoupon(i:number){
    this.showShureWindow = false
    let code = this.generateCouponCode()
    this.activeCode = code;
    let activatedCoupon = this.coupons[i];
    this.base.orderCoupon(activatedCoupon, code, this.loggedInUid)
    .then(() => {
      this.currentCodes.push({code: code, index: i })
      console.log('Az adatfeltöltés sikeres volt a komponensben!');
    })
    .catch((error:any) => {
      // Hiba esetén végrehajtandó műveletek a komponensben
      console.error('Hiba történt az adatfeltöltés során a komponensben:', error);
    });
  }


 generateCouponCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let couponCode = '';
    const codeLength = 5;
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      couponCode += characters[randomIndex];
    }
    return couponCode;
  }

  

  
}


