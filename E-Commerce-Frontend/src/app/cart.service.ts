import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems = new BehaviorSubject<number>(0);
  cartItems$ = this.cartItems.asObservable();

  constructor() { }

  incrementCartCount() {
    const currentCount = this.cartItems.value;
    this.cartItems.next(currentCount + 1);
  }
  
  updateCartCount(count: number) {
    this.cartItems.next(count);
  }
}
