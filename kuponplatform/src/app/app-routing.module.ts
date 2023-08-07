import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderProfileComponent } from './provider-profile/provider-profile.component';
import { ProviderNewCouponComponent } from './provider-new-coupon/provider-new-coupon.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ProviderCheckoutComponent } from './provider-checkout/provider-checkout.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FeedComponent } from './feed/feed.component';

const routes: Routes = [
  {path: 'providerProfile', component: ProviderProfileComponent, canActivate: [AuthGuard]},
  {path: 'feed', component: FeedComponent, canActivate: [AuthGuard]},
  {path: 'providerNewCoupon', component: ProviderNewCouponComponent, canActivate: [AuthGuard]},
  {path: 'providerCheckout', component: ProviderCheckoutComponent, canActivate: [AuthGuard]},
  {path: 'registration', component: RegistrationComponent},
  {path: 'userProfile', component: UserProfileComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', component: HomeComponent},
  {path: '', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
