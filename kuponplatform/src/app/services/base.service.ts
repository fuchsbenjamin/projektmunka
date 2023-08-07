import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, finalize, map } from 'rxjs';
import { Coupon } from '../coupon';
import { AngularFireStorage, AngularFireStorageModule, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Order } from '../order';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private couponsCollection!: AngularFirestoreCollection<Coupon>;
  couponsWithRates = [{id:'', rate:[0]}]
  averageRates = [{id:'', rate:0}]

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private db: AngularFireDatabase) {
    this.couponsCollection = this.firestore.collection<Coupon>('coupons');
  }


  orderCoupon(coupon: any, id: string, userUid:any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.object(id).set({name: coupon.name, price: coupon.price, code: id, inc: coupon.includes, payed: false, ready: false, uid: coupon.uid, userUid: userUid, couponCode: coupon.couponId})
        .then(() => {
          console.log('Az adatfeltöltés sikeres volt a komponensben!');
          resolve(); // Visszaadjuk az üres Promise-t a sikeres végrehajtás jelzésére
        })
        .catch((error) => {
          console.error('Hiba történt az adatfeltöltés során a komponensben:', error);
          reject(error); // Visszaadjuk az üres Promise-t a hiba jelzésére
        });
    });
  }

  getOrders(): Observable<Order[]> {
    return this.db.object('/').valueChanges().pipe(
      map((data: any) => {
        const orders: Order[] = [];
        Object.keys(data).forEach(key => {
          orders.push(data[key] as Order);
        });
        return orders;
      })
    );
  }

  updateOrderStatus(order:Order){
    this.db.object(order.code).update({payed: true})
  }

  readyOrder(order:Order){
    this.db.object(order.code).update({ready: true})
  }

  cancelOrder(code:string){
    this.db.object(code).remove()
  }

  delOrder(order:Order){
    this.db.object(order.code).remove()
  }

  uploadTags(tagek:string[], uid:string){
    this.firestore.collection('provider').doc(uid).update({tags: tagek })
    .then(()=>console.log('tags feltöltve'))
    
    
    .catch((error)=>{console.log('hiba a feltöltésben', error)})
  }

  
addNewRate(rate: number, couponId: string) {
  this.firestore.collection('coupons').doc(couponId).get()
  .subscribe((doc: any) => {
    if (doc.exists) {
      const currentRates = doc.data().rate || []; // Mező jelenlegi értéke vagy üres tömb
      currentRates.push(rate); // Új szám hozzáadása a tömbhöz
      
      this.firestore.collection('coupons').doc(couponId).update({
        rate: currentRates // Frissítjük a mezőt az új tömbbel
      })
      .then(() => {
        console.log('Az új elem sikeresen hozzáadva az arraly mezőhöz!');
      })
      .catch((error) => {
        console.error('Hiba történt az új elem hozzáadása közben:', error);
      });
    }
  });
}

getCoupons(): Observable<any[]> {
  this.couponsWithRates = [];

  return this.couponsCollection.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Coupon;
        data.couponId = a.payload.doc.id;
        const rates = data.rate || [];

        const existingCouponIndex = this.couponsWithRates.findIndex(coupon => coupon.id === data.couponId);

        if (existingCouponIndex !== -1) {
          this.couponsWithRates[existingCouponIndex].rate = rates; // Frissítsd az értéket
        } else {
          this.couponsWithRates.push({ id: data.couponId, rate: rates }); // Hozzáadás, ha még nem volt benne
        }

        this.calculateAverage(); // Itt hívod meg a calculateAverage függvényt
        console.log('ez az amit keresek: ', this.averageRates);

        return { ...data };
      });
    })
  );
}



  calculateAverage() {
    this.averageRates = [];
  
    for (let i = 0; i < this.couponsWithRates.length; i++) {
      const coupon = this.couponsWithRates[i];
      const rates = coupon.rate;
  
      let sum = 0;
      let count = 0;
  
      for (let j = 0; j < rates.length; j++) {
        sum += rates[j];
        count++;
      }
  
      const average = sum / count;
      const roundedAverage = Math.round(average * 10) / 10; // Kerekítés egy tizedesre
  
      this.averageRates.push({ id: coupon.id, rate: roundedAverage });
    }
  }
  

  

  deleteCoupon(couponId: string): void {
    this.firestore.collection('coupons').doc(couponId).delete()
      .then(() => {
        console.log('Elem törölve.');
      })
      .catch((error) => {
        console.error('Hiba történt a törlés során:', error);
      });
  }

  editCoupon(couponId:string, name: string,  includes:string, text: string, price: number) {
    this.firestore.collection('coupons').doc(couponId).update({name: name, includes: includes, text: text, price: price})
    .then(()=>{
      console.log('minden oké a módosítással')
    })
    .catch((e)=>{
      console.log('sajnos hiba van', e)
    })
  }
  

  uploadImage(file: File): Observable<string> {
    const filePath = `coupon_images/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task: AngularFireUploadTask = this.storage.upload(filePath, file);

    // Az állapotfrissítések és a letöltési URL visszaadásához használt Observable
    return new Observable<string>(observer => {
      task.percentageChanges().subscribe(
        (percentage: number | undefined) => {
          if (percentage !== undefined) {
            const roundedPercentage = Math.round(percentage);
            console.log('Feltöltési állapot:', roundedPercentage, '%');
            observer.next(roundedPercentage.toString());
          }
        },
        (error) => {
          observer.error(error);
          observer.complete();
        },
        async () => {
          try {
            const downloadUrl = await fileRef.getDownloadURL().toPromise();
            console.log('File available at: ', downloadUrl);
            observer.next(downloadUrl);
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        }
      );
    }).pipe(
      finalize(() => {
      })
    );
  }

}

