import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlistCountKey = 'wishlistCount';
  private wishlistItems = new BehaviorSubject<number>(this.loadWishlistCount());
  wishlistItems$ = this.wishlistItems.asObservable();

  constructor() {
    this.wishlistItems.next(this.loadWishlistCount());
  }

  incrementWishlistCount() {
    const currentCount = this.wishlistItems.value;
    const newCount = currentCount + 1;
    this.saveWishlistCount(newCount);
    this.wishlistItems.next(newCount);
  }

  decrementWishlistCount() {
    const currentCount = this.wishlistItems.value;
    if (currentCount > 0) {
      const newCount = currentCount - 1;
      this.saveWishlistCount(newCount);
      this.wishlistItems.next(newCount);
    }
  }

  updateWishlistCount(count: number) {
    this.saveWishlistCount(count);
    this.wishlistItems.next(count);
  }

  getWishlistCount(): number {
    return this.wishlistItems.value;
  }

  private saveWishlistCount(count: number) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.wishlistCountKey, count.toString());
    } else {
    }
  }

  private loadWishlistCount(): number {
    if (typeof localStorage !== 'undefined') {
      const storedCount = localStorage.getItem(this.wishlistCountKey);
      return storedCount ? parseInt(storedCount, 10) : 0;
    } else {
      return 0;
    }
  }
}
