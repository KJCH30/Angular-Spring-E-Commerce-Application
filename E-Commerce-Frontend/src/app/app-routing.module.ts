import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './_auth/auth.guard';
import { VendorComponent } from './vendor/vendor.component';
import { AddNewProductComponent } from './add-new-product/add-new-product.component';
import { ShowProductDetailsComponent } from './show-product-details/show-product-details.component';
import { ProductResolveService } from './_services/product-resolve.service';
import { ProductViewDetailsComponent } from './product-view-details/product-view-details.component';
import { BuyProductComponent } from './buy-product/buy-product.component';
import { BuyProductResolverService } from './_services/buy-product-resolver.service';
import path from 'path';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { RegisterVendorComponent } from './register-vendor/register-vendor.component';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard], data: { roles: ['User'] } },
  { path: 'vendor', component: VendorComponent, canActivate: [AuthGuard], data: { roles: ['Vendor'] } },
  { path: 'login', component: LoginComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  {
    path: 'addNewProduct', component: AddNewProductComponent, canActivate: [AuthGuard], data: { roles: ['Vendor', 'Admin'] },
    resolve: {
      product: ProductResolveService
    }
  },
  { path: 'showAddedProducts', component: ShowProductDetailsComponent, canActivate: [AuthGuard], data: { roles: ['Vendor', 'Admin'] } },
  {
    path: 'productViewDetails', component: ProductViewDetailsComponent, resolve: {
      product: ProductResolveService
    }
  },
  {
    path: 'buyProduct', component: BuyProductComponent, canActivate: [AuthGuard], data: { roles: ['User'] },
    resolve: {
      productDetails: BuyProductResolverService
    }
  },
  {
    path: 'cart', component: CartComponent, 
    canActivate: [AuthGuard], data: { roles: ['User'] }
    
  },
  {
    path: 'wishlist', component: WishlistComponent, 
    canActivate: [AuthGuard], data: { roles: ['User'] }
    
  },
  { path: 'orderConfirmed', component: OrderConfirmationComponent,
    canActivate: [AuthGuard], data: {roles: ["User"]}
  },
  { path: 'myOrders', component: MyOrdersComponent,
    canActivate: [AuthGuard], data: {roles: ["User"]}
  },
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "registerVendor",
    component: RegisterVendorComponent
  },
  { path: 'orderInfo', component: OrderDetailsComponent,
    canActivate: [AuthGuard], data: {roles: ["Admin"]}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
