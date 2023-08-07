import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, map } from 'rxjs';
import { UserDataModel } from '../user-data-model';
import { ProviderDataModel } from '../provider-data-model';
import { TagekService } from '../services/tagek.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { FormControl, Validators} from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule} from '@angular/material/input';
import { MatFormField} from '@angular/material/form-field';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatIcon } from '@angular/material/icon';
import { StepperOrientation, MatStepperModule} from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Route, Router } from '@angular/router';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { ProfileComponent } from '../profile/profile.component';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  userData: UserDataModel;
  providerData: ProviderDataModel;
  password: string = '';
  passwordAgain: string = '';
  isChecked:boolean = false;
  isLoggedIn?: Observable<boolean>;
  currentEmail?: string;
  tags:string[];
  stepperOrientation!: Observable<StepperOrientation>;
  isEditable = true;
  userRegistration!: FormGroup;
  providerRegistration!: FormGroup;

  @Output() provCloseRegistration = new EventEmitter<boolean>();

  closeProvReg() {
    this.provCloseRegistration.emit(false);
  }

  constructor(private authService: AuthService, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, private tagek: TagekService, private route: Router) { 
    
    this.tags = this.tagek.tagek;

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));

      this.userRegistration = new FormGroup({
        firstNameFormControl : new FormControl('', [Validators.required]),
        lastNameFormControl : new FormControl('', [Validators.required]),
        emailFormControl : new FormControl('', [Validators.required, Validators.email]),
        passwordFormControl : new FormControl('', [Validators.required, Validators.minLength(8)]),
        birthdayFormControl : new FormControl('', [Validators.required]),        
      })


      this.providerRegistration = new FormGroup({
        nameFormControl: new FormControl('', [Validators.required]),
        emailFormControl: new FormControl('', [Validators.required, Validators.email]),
        cityFormControl: new FormControl('', [Validators.required]),
        streetFormControl: new FormControl('', [Validators.required]),
        houseNumberFormControl: new FormControl('', [Validators.required]),
        phoneNumberFormControl: new FormControl('', [Validators.required]),
        passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(8)]),      
      })



    this.userData = {
      firstName:'',
      lastName:'',
      email:'',
      birthDay: new Date(1999, 0, 0),
      tags: [],
      type: ''
    };

    this.providerData = {
      name:'',
      email:'',
      location: {
        city:'',
        street:'',
        houseNumber:0,
        },
      tags:[],
      phoneNumber:0,
      openingHours: {
          monday: {from: 0, to: 0},
          tuesday:{from: 0, to: 0},
          wednesday:{from: 0, to: 0},
          thursday:{from: 0, to: 0},
          friday:{from: 0, to: 0},
          saturday:{from: 0, to: 0},
          sunday:{from: 0, to: 0}
        },
      type:''
    }
    
  }

  

  onSubmit() {
    if(this.userData.type == 'user'){
      this.currentEmail = this.userData.email;

      this.authService.userRegister(this.currentEmail, this.password, this.userData)
      .then(() => {
        // Sikeres regisztráció
        this.authService.currentUserType.subscribe(currentUserData => {
          if (currentUserData) {
            if (currentUserData == 'user') {
              this.route.navigate(['/feed']); // User típusú felhasználó
            } else if (currentUserData == 'provider') {
              this.route.navigate(['/providerProfile']); // Provider típusú felhasználó
            }
          }
        });
      })
      .catch((error) => {
        // Hiba történt a regisztráció során
        console.error('Registration failed', error);
      });
    }
    
    if(this.providerData.type == 'provider'){
      this.currentEmail = this.providerData.email;
      this.authService.providerRegister(this.currentEmail, this.password, this.providerData)
      .then(() => {
        // Sikeres regisztráció
        console.log('Registration successful');
      })
      .catch((error) => {
        // Hiba történt a regisztráció során
        console.error('Registration failed', error);
      });
    }

    
    
  }}
