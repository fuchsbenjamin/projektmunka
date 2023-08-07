import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { UserDataModel } from '../user-data-model';
import { ProviderDataModel } from '../provider-data-model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUserData: BehaviorSubject<UserDataModel | ProviderDataModel | null> = new BehaviorSubject<UserDataModel | ProviderDataModel | null>(null);
  currentUid: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  isLoggedIn: Observable<firebase.User | null>;
  uid?: string;
  currentUserType: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  constructor(private afAuth: AngularFireAuth, private fs: AngularFirestore, private router: Router) {
    this.isLoggedIn = this.afAuth.authState;

    this.isLoggedIn.subscribe((user: firebase.User | null) => {
      if (user) {
        this.currentUid.next(user.uid);
        this.fs.collection('user').doc(user.uid).get().subscribe((doc) => {
          if (doc.exists) {
            this.currentUserData.next(doc.data() as UserDataModel);
            this.currentUserType.next('user'); // Érték beállítása
            console.log(this.currentUserType.value)
          }
        });
        this.fs.collection('provider').doc(user.uid).get().subscribe((doc) => {
          if (doc.exists) {
            this.currentUserData.next(doc.data() as ProviderDataModel);
            this.currentUserType.next('provider'); // Érték beállítása
          }
        });
      } else {
        this.currentUid.next(undefined);
        this.currentUserData.next(null);
        this.currentUserType.next(undefined); // Érték beállítása
      }
    });
  }

  
  getLoggedInUid(): string | undefined {
    return this.uid;
  }


  userRegister(email: string, password: string, user: UserDataModel) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (userCredential && userCredential.user) {
          this.uid = userCredential.user.uid; // UID lekérése
          this.fs.collection('user').doc(this.uid).set({ user });
          this.router.navigate(['../provider-profile/provider-profile.component']);
        }
      })
      .catch((error) => {
        console.log('nem jó a reg');
      });
  }

  providerRegister(email: string, password: string, provider: ProviderDataModel) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (userCredential && userCredential.user) {
          this.uid = userCredential.user.uid; // UID lekérése
          this.fs.collection('provider').doc(this.uid).set({ provider });
        }
      })
      .catch((error) => {
        console.log('nem jó a reg');
      });
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }

  

}