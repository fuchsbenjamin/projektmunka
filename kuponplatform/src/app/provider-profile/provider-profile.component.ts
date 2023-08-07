import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ProviderDataModel } from '../provider-data-model';
import { UserDataModel } from '../user-data-model';
import { TagekService } from '../services/tagek.service';

import { MatButton } from '@angular/material/button';
import { MatButtonModule} from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import { EventsService } from '../services/events.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BaseService } from '../services/base.service';
import { Coupon } from '../coupon';
import { Order } from '../order';
import { RateService } from '../services/rate.service';
import { RatesAndCode } from '../rates-and-code';


@Component({
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.component.html',
  styleUrls: ['./provider-profile.component.css']
})
export class ProviderProfileComponent implements OnInit {

  currentUserData!:UserDataModel | ProviderDataModel | null;
  providedTags:string[] = [];
  addCouponField = false;
  tags:string[] = [];
  selectedTags: string[] = [];
  tagsSelectionOpen: boolean = false;
  loggedInUid:any;
  ownedCoupons:Coupon[] = [];
  sureDelete:boolean = false;
  selectedCoupon?:number;
  ordersInProgress:Order [] = [];
  ordersReady:Order [] = [];
  currentCode:string = '';
  currentCoupon:Order[]=[];
  couponsInProgres:Order[]=[]
  order:any;
  isEditing:boolean = false;
  averageRates=[{id:'', rate:0}]

  couponEditData = {
    name: '',
    includes: '',
    text: '',
    price: 0
  };
  
  handleCloseCloupon(value: boolean) {
    this.addCouponField = value;
  }

  constructor(private auth:AuthService, private tagsService: TagekService, private base: BaseService) { 
    this.auth.currentUserData.subscribe((data)=>{
       this.currentUserData = data;
       this.auth.currentUid.subscribe((uid) => {
        this.loggedInUid = uid;
        console.log(this.loggedInUid)
        if(this.currentUserData){this.providedTags = this.currentUserData?.tags}
        
      });
    })

    //my coupons

    this.base.getCoupons().subscribe((coupons)=>{
      this.ownedCoupons = [];
      coupons.forEach(x=>{
        if(x.uid == this.loggedInUid){this.ownedCoupons.push(x); console.log(this.ownedCoupons)}
      })
      this.averageRates = [];
      this.base.averageRates.forEach(x=>{
        this.averageRates.push({id:x.id, rate: x.rate})
      })
      
    })

    this.base.getOrders().subscribe((orders)=>{
      this.ordersInProgress = []
      this.ordersReady = []
      orders.forEach(x=>{
        if(x.uid == this.loggedInUid && x.payed == true && x.ready == false){this.ordersInProgress.push(x)}
        if(x.uid == this.loggedInUid && x.payed == true && x.ready == true){this.ordersReady.push(x)}
      })
    })

    this.tags = this.tagsService.tagek;
    
  }

  reallyDelete(i:number){

    this.sureDelete = true;
    this.selectedCoupon = i
  }
  deleteItem(coupon: Coupon): void {
    console.log(coupon);
    this.base.deleteCoupon(coupon.couponId);
  }

  editable(i:number){
    this.isEditing = true; 
    this.selectedCoupon = i
    this.couponEditData = {
      name: this.ownedCoupons[i].name,
      includes: this.ownedCoupons[i].includes,
      text: this.ownedCoupons[i].text,
      price: this.ownedCoupons[i].price
    };
  }

  uptadeCoupon(coupon:Coupon, i:number){
    
    this.base.editCoupon(
      coupon.couponId,
      this.couponEditData.name,
      this.couponEditData.includes,
      this.couponEditData.text,
      this.couponEditData.price
    )

    this.isEditing = false;
  }

  


    //ORDER

    loadOrder() {
      this.order = this.base.getOrders();
      this.order.subscribe((data: Order[]) => {
        data.forEach(x=>{
          if(x.code == this.currentCode){this.currentCoupon.push(x)}
        }) // Átmásoljuk az Observable által adott Order[] tömböt a currentCoupon tömbbe
      });
    }

    payedOrders(order:Order){
      this.ordersInProgress.push(order)
      this.base.updateOrderStatus(order)
      this.currentCoupon = [];
      this.currentCode = '';
      console.log(this.currentCoupon)
    }

    readyOrder(order:Order, i:number){
      this.base.readyOrder(order)
      this.ordersReady.push(order)
      this.ordersInProgress.splice(i, 1)
    }

    delOrder(order:Order, i:number){
      this.base.delOrder(order)
      this.ordersReady.splice(i, 1)
    }


  ngOnInit(): void {
    
  }

}
