import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Router } from '@angular/router';
import { WishlistService } from '../wishlist.service';
import { CartService } from '../cart.service';
import { Product } from '../_model/product.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  displayedColumns: string[] = ['Product Name', 'Description', 'Price', 'Discounted Price', 'Add To Cart', 'Remove'];
  wishlistDetails = [];
  productDetails: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private wishlistService: WishlistService,
    private cartService: CartService  
  ) { }

  ngOnInit(): void {
    this.getWishlistDetails();
  }

  getWishlistDetails() {
    this.productService.getWishlistDetails().subscribe({
      next: (response: any) => {
        console.log(response);
        this.wishlistDetails = response;
        this.wishlistService.updateWishlistCount(this.wishlistDetails.length);
      },
      error: (error) => {
        console.log(error);    
      }
    });
  }

  addToCart(productId: number, wishlistId: number, event: Event) {
    event.stopPropagation();
    this.productService.addToCart(productId).subscribe({
      next: (response) => {
        console.log(response);
        if (response) {
          this.cartService.incrementCartCount();
          const product = this.productDetails.find(p => p.productId === productId);
          if (product) {
            product.isAddedToCart = true;
          }
          this.delete(wishlistId);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  delete(wishlistId: number): void {
    this.productService.deleteWishlistItem(wishlistId).subscribe({
      next: (response) => {
        console.log(response);
        this.getWishlistDetails();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  toggleDescription(element: any) {
    element.showFullDescription = !element.showFullDescription;
  }
}
