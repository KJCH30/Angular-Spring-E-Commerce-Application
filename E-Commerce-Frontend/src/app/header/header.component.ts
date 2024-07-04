import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { CartService } from '../cart.service';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartCount = 0;
  wishlistCount = 0;

  constructor(
    private userAuthService: UserAuthService, 
    private router: Router,
    public userService: UserService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    // Subscribe to cart count observable to get the initial count and updates
    this.cartService.cartItems$.subscribe(count => {
      this.cartCount = count;
    });

    // Subscribe to wishlist count observable to get the initial count and updates
    this.wishlistService.wishlistItems$.subscribe(count => {
      this.wishlistCount = count;
    });
  }

  public isLoggedIn() {
    return this.userAuthService.isLoggedIn();
  }

  public logout() {
    this.userAuthService.clear();
    this.router.navigate(['/']);
  }

  public isVendor() {
    return this.userAuthService.isVendor();
  }

  public isUser() {
    return this.userAuthService.isUser();
  }

  public isAdmin() {
    return this.userAuthService.isAdmin();
  }
}
