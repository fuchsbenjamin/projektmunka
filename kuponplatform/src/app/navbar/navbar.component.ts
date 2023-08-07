import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { UserDataModel } from '../user-data-model';
import { ProviderDataModel } from '../provider-data-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showSideNav = false;
  menuPoints = [
    { txt: 'profile', path: 'userProfile', icon: 'perm_identity' },
    { txt: 'new coupon', path: 'providerNewCoupon', icon: 'add' },
    { txt: 'check out', path: 'providerCheckout', icon: 'store' },
  ]
  
  isLoggedIn = false;
  sideMenuOpen = false;
  currentUserData!:UserDataModel | ProviderDataModel | null;

  constructor(private auth: AuthService, private route: Router) {
    
  }

  
  logout() {
    this.auth
      .logout()
      .then(() => {
        console.log('logout success');
        this.route.navigate(['/home'])
      })
      .catch((error) => {
        console.log('logout error', error);
      });
  }



  ngOnInit(): void {
  this.auth.isLoggedIn.subscribe((user) => {
    this.isLoggedIn = user !== null;
    if (user) {
      this.auth.currentUserData.subscribe((userData) => {
        this.currentUserData = userData;
      });
    }
  });
}
}  