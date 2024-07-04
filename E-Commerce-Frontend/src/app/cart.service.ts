import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCountKey = 'cartCount';
  private cartCountSubject = new BehaviorSubject<number>(this.loadCartCount());
  cartItems$ = this.cartCountSubject.asObservable();

  constructor() {
    this.cartCountSubject.next(this.loadCartCount());
  }

  incrementCartCount() {
    const currentCount = this.cartCountSubject.value;
    const newCount = currentCount + 1;
    this.saveCartCount(newCount);
    this.cartCountSubject.next(newCount);
  }

  decrementCartCount() {
    const currentCount = this.cartCountSubject.value;
    if (currentCount > 0) {
      const newCount = currentCount - 1;
      this.saveCartCount(newCount);
      this.cartCountSubject.next(newCount);
    }
  }

  private saveCartCount(count: number) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.cartCountKey, count.toString());
    } else {
    }
  }

  private loadCartCount(): number {
    if (typeof localStorage !== 'undefined') {
      const storedCount = localStorage.getItem(this.cartCountKey);
      return storedCount ? parseInt(storedCount, 10) : 0;
    } else {
      return 0;
    }
  }

  updateCartCount(count: number) {
    this.saveCartCount(count);
    this.cartCountSubject.next(count);
  }
}
