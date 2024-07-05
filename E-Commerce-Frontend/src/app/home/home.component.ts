import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../_model/product.model';
import { ImageProcessingService } from '../_services/image-processing.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { WishlistService } from '../wishlist.service';
import { UserAuthService } from '../_services/user-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pageNumber: number = 0;
  productDetails: Product[] = [];
  showLoadButton = false;
  allProductDetails: Product[] = [];

  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private wishlistService: WishlistService,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.getAllProducts("", "none");
  }

  public getAllProducts(searchKey: string = "", filter: string = "none") {
    this.productService.getAllProducts(this.pageNumber, searchKey, filter)
      .pipe(
        map((x: Product[], i: any) => x.map((product: Product) => this.imageProcessingService.createImages(product)))
      )
      .subscribe({
        next: (resp: Product[]) => {
          console.log(resp);
          this.showLoadButton = resp.length == 8;

          if (this.userAuthService.isLoggedIn() && this.userAuthService.isUser()) {
            this.productService.getWishlistDetails().subscribe({
              next: (wishlistItems: any[]) => {
                const wishlistMap = new Map<number, any>();
                wishlistItems.forEach(item => {
                  wishlistMap.set(item.product.productId, item.wishlistId);
                });

                resp.forEach(product => {
                  if (wishlistMap.has(product.productId)) {
                    product.isWishlisted = true;
                    product.wishlistId = wishlistMap.get(product.productId);
                  } else {
                    product.isWishlisted = false;
                    product.wishlistId = 0;
                  }
                  this.allProductDetails.push(product);
                  this.productDetails.push(product);
                });
              },
              error: (error) => {
                console.log(error);
              }
            });
          } else {
            resp.forEach(product => {
              product.isWishlisted = false;
              product.wishlistId = 0;
              this.allProductDetails.push(product);
              this.productDetails.push(product);
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      });
  }

  public showProductDetails(productId: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/productViewDetails', { productId: productId }]);
  }

  public loadMoreProduct() {
    this.pageNumber += 1;
    this.getAllProducts("", "none");
  }

  searchByKeyword(searchkeywords: string) {
    this.pageNumber = 0;
    this.productDetails = [];
    this.getAllProducts(searchkeywords, "none");
  }

  addToCart(productId: number, event: Event) {
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
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  toggleWishlist(product: any, productId: number, event: Event) {
    event.stopPropagation();
    if (product.isWishlisted) {
      this.productService.deleteWishlistItem(product.wishlistId).subscribe({
        next: (response) => {
          console.log(response);
          this.wishlistService.decrementWishlistCount();
          product.isWishlisted = false;
          product.wishlistId = null;
          this.snackBar.open('Product removed from wishlist', 'Close', { duration: 2000 });
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      this.productService.addToWishlist(productId).subscribe({
        next: (response: any) => {
          console.log(response);
          this.wishlistService.incrementWishlistCount();
          product.isWishlisted = true;
          product.wishlistId = response.wishlistId;
          this.snackBar.open('Product added to wishlist', 'Close', { duration: 2000 });
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  public filterProducts(filter: string) {
    this.productDetails = [];
    this.getAllProducts("", filter);
  }

  public isUser() {
    return this.userAuthService.isUser();
  }

  restartAnimation(event: Event) {
    const descriptionElement = (event.currentTarget as HTMLElement).querySelector('.product-description') as HTMLElement;
    if (descriptionElement) {
      descriptionElement.style.animation = 'none';
      descriptionElement.offsetHeight;
      descriptionElement.style.animation = '';
    }
  }
}
