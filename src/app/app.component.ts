import { Component } from '@angular/core';


import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';


import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CashRegisterComponent } from './components/cash-register/cash-register.component';
import { HomeComponent } from './components/home/home.component';
import { PagesComponent } from './components/pages/pages.component';
import { PriceListComponent } from './components/price-list/price-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StocktakingComponent } from './components/stocktaking/stocktaking.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { SupplierFormComponent } from './components/supplier-form/supplier-form.component';
import { UsersComponent } from './components/users/users.component';
import { UsersFormComponent } from './components/users-form/users-form.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { TypeUserService } from './services/typeUser/type-user.service';
import { PurchasesService } from './services/purchases/purchases.service';
import { ShoppingService } from './services/shopping/shopping.service';
import { CustomerService } from './services/customer/customer.service';
import { ProductService } from './services/product/product.service';
import { SupplierService } from './services/supplier/supplier.service';
import { UsersService } from './services/users/users.service';



@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, RouterOutlet, FormsModule, CommonModule, NavBarComponent,ReactiveFormsModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']

})
export class AppComponent {
}







