import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Coupon } from '../coupon';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from '../services/auth.service';
import { UserDataModel } from '../user-data-model';
import { ProviderDataModel } from '../provider-data-model';
import { EventsService } from '../services/events.service';
import { UrlTree } from '@angular/router';
import { BaseService } from '../services/base.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UploadTaskSnapshot } from '@angular/fire/compat/storage/interfaces';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-provider-new-coupon',
  templateUrl: './provider-new-coupon.component.html',
  styleUrls: ['./provider-new-coupon.component.css']
})
export class ProviderNewCouponComponent implements OnInit {
  currentUserData!:UserDataModel | ProviderDataModel | null;
  loggedInUid:any;
  @Output() closeChanged = new EventEmitter<any>();

  coupon:Coupon = {
    couponId:'',
    name:'',
    price:NaN,
    includes:'',
    id:'',
    text:'',
    uid:'',
    img:'',
    rate:[]
}

  isUploadingImage = false;
  isImageUploaded: boolean = false;
  uploadProgress!:string
  newCouponForm: FormGroup;
  @Output() closeCoupon = new EventEmitter<boolean>();

  clickCloseCoupon() {
    this.closeCoupon.emit(false);
  }

  constructor( private firestore: AngularFirestore, private auth: AuthService, private base: BaseService, private formBuilder: FormBuilder){ 
    this.newCouponForm = this.formBuilder.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      price: [0, Validators.required],
      includes: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.auth.currentUserData.subscribe((data)=>{
      this.currentUserData = data;
      this.auth.currentUid.subscribe((uid) => {
        this.loggedInUid = uid;
        console.log(this.loggedInUid)
      });
   })
  }

  generateCouponId() {
    let couponId = 'C-' + Math.random().toString().substr(2, 8).toUpperCase();
    this.coupon.id = couponId;
  }

addCouponToFirestore(){
  this.coupon.uid = this.loggedInUid;
  this.generateCouponId();
  this.firestore.collection('coupons').add(this.coupon)
  .then((docRef) => {
    console.log('Elem sikeresen hozzáadva, ID:', docRef.id);
    this.clickCloseCoupon()
  })
  .catch((error) => {
    console.error('Hiba történt az elem hozzáadása közben:', error);
  });

  this.coupon.name = '';
  this.coupon.price = NaN;
  this.coupon.includes = '';
  this.coupon.text = ''
}




async handleFileInput(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.isUploadingImage = true; // Indítsd el az állapotfigyelést
  this.isImageUploaded = false;

  try {
    this.base.uploadImage(file).subscribe(
      (progress: string) => {
        this.uploadProgress = progress; // Frissítsd a feltöltési állapotot a komponensben
      },
      (error) => {
        console.error('Hiba történt a kép feltöltése közben:', error);
      },
      () => {
        this.isUploadingImage = false; // Állapotfigyelés leállítása
        this.isImageUploaded = true; // Állítsd be a változót igazra, ha a kép feltöltése befejeződött
        this.coupon.img = this.uploadProgress
      }
    );
  } catch (error) {
    console.error('Hiba történt a kép feltöltése közben:', error);
    this.isUploadingImage = false; // Állapotfigyelés leállítása
    this.isImageUploaded = false; // Állítsd vissza hamisra, ha a feltöltés nem sikerült
  }

}


}


