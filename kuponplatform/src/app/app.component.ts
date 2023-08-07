import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kuponplatform';
  currentUserData:any = ''
  constructor(private auth: AuthService){
     this.currentUserData = this.auth.currentUserData
  }
}
