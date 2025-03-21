import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CashRegisterComponent } from './components/cash-register/cash-register.component';
import { StocktakingComponent } from './components/stocktaking/stocktaking.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersComponent } from './components/users/users.component';
import { PurchaseComponent } from './components/purchase/purchase.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'cash', component: CashRegisterComponent },
  { path: 'inventory', component: StocktakingComponent },
  { path: 'purchase', component: PurchaseComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin', component: UsersComponent },
  { path: '**', redirectTo: 'home' } 
];

