import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loginError: boolean = false;
  isEditable = true;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required,],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
 
  @Output() closeLogin = new EventEmitter<boolean>();

  clickCloseLogin() {
    this.closeLogin.emit(false);
  }
  

  constructor( private auth: AuthService, private _formBuilder: FormBuilder, private route: Router) { }
  
  

  onSubmit() {
    
    this.auth.login(this.email, this.password)
      .then(() => {
        this.auth.currentUserType.subscribe(currentUserData => {
          if (currentUserData) {
            if (currentUserData == 'user') {
              this.route.navigate(['/feed']); // User típusú felhasználó
            } else if (currentUserData == 'provider') {
              this.route.navigate(['/providerProfile']); // Provider típusú felhasználó
            }
          } else {
            this.loginError = true;
            console.log(this.loginError);
          }
        });
      })
      .catch(() => {
        this.loginError = true;
        console.log(this.loginError);
      });
  }

  ngOnInit(): void {
  }

}
