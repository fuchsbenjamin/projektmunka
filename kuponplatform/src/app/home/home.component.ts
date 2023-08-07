import { Component, OnInit } from '@angular/core';
import { RegistrationComponent } from '../registration/registration.component';
import { AuthService } from '../services/auth.service';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

showRegistration:boolean = false;
showLogin:boolean = false;


  constructor(private auth: AuthService) {
    
   }

   handleProvCloseReg(value: boolean) {
    this.showRegistration = value;
  }

  handleCloseLogin(value: boolean) {
    this.showLogin = value;
  }


  ngOnInit(): void {
    
  }

}
