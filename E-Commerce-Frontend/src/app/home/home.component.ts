import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../_model/product.model';
import { ImageProcessingService } from '../_services/image-processing.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  pageNumber: number = 0
  productDetails: Product[] = [];
  showLoadButton = false;

  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router,
    private cartService: CartService,
    private snackBar: MatSnackBar,

  ) { }
  ngOnInit(): void {
    this.getAllProducts()
  }

  public getAllProducts(searchKey: string = "") {
    this.productService.getAllProducts(this.pageNumber, searchKey)
      .pipe(
        map((x: Product[], i: any) => x.map((product: Product) => this.imageProcessingService.createImages(product)))
      )
      .subscribe({
        next: (resp: Product[]) => {
          console.log(resp);
          if (resp.length == 8) {
            this.showLoadButton = true
          } else {
            this.showLoadButton = false
          }
          resp.forEach(p => this.productDetails.push(p))
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      }

      )
  }

  public showProductDetails(productId: any, event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevents the click from propagating to the card
    }
    this.router.navigate(['/productViewDetails', { productId: productId }])
  }

  public loadMoreProduct() {
    this.pageNumber += 1;
    this.getAllProducts()
  }
  searchByKeyword(searchkeywords: string) {
    this.pageNumber = 0;
    this.productDetails = []
    this.getAllProducts(searchkeywords)
  }

  addToCart(productId: number, event: Event) {
    event.stopPropagation();
    this.productService.addToCart(productId).subscribe({
      next: (response) => {
        console.log(response);
        if (response) {  // Check if cartId is present in response
          this.cartService.incrementCartCount();
          const product = this.productDetails.find(p => p.productId === productId);
          if (product) {
            product.isAddedToCart = true; // Add a flag to track if added to cart
          }
        }
      },

      error: (error) => {
        console.log(error);
      }

    })
  }

  // Toggle Wishlist Method
  toggleWishlist(product: any, event: Event) {
    event.stopPropagation(); // Prevents the click from propagating to the card
    product.isWishlisted = !product.isWishlisted; // Toggle wishlist status
    // Optionally, add/remove product from wishlist in backend
    if (product.isWishlisted) {
      this.snackBar.open('Product added to wishlist', 'Close', { duration: 2000 });
    } else {
      this.snackBar.open('Product removed from wishlist', 'Close', { duration: 2000 });
    }
  }

}
