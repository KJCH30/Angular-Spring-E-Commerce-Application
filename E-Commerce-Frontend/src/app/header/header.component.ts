import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../_services/user-auth.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartCount = 0;

  constructor(private userAuthService: UserAuthService, 
    private router: Router,
    public userService: UserService,
    private cartService: CartService
  ){}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(count => {
      this.cartCount = count;
    });
  }

  public isLoggedIn(){
    return this.userAuthService.isLoggedIn();
  }

  public logout(){
    this.userAuthService.clear();
    this.router.navigate(['/'])
  }

  public isVendor(){
    return this.userAuthService.isVendor();
  }

  public isUser(){
    return this.userAuthService.isUser();
  }

  public isAdmin(){
    return this.userAuthService.isAdmin();
  }
}
