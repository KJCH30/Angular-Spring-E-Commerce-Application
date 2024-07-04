import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
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
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  pageNumber: number = 0
  productDetails: Product[] = [];
  showLoadButton = false;
  allProductDetails: Product[] = [];


  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private wishlistService: WishlistService,
    private userAuthService: UserAuthService

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

                // Check if the response length matches the page size to decide whether to show the load button
                this.showLoadButton = resp.length == 8;

                if (this.userAuthService.isLoggedIn() && this.userAuthService.isUser()) {
                    // Fetch wishlist details only if the user is logged in
                    this.productService.getWishlistDetails().subscribe({
                        next: (wishlistItems: any[]) => {
                            // Create a map of productId to wishlistId for quick lookup
                            const wishlistMap = new Map<number, any>();
                            wishlistItems.forEach(item => {
                                wishlistMap.set(item.product.productId, item.wishlistId);
                            });

                            // Update the product details with wishlist information
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
          product.wishlistId = response.wishlistId; // Store the returned wishlistId
          this.snackBar.open('Product added to wishlist', 'Close', { duration: 2000 });
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  // Filter products based on selection
  public filterProducts(filter: string) {
    if (filter === 'none') {
        this.productDetails = [...this.allProductDetails];
    } else if (filter === 'lowToHigh') {
        this.productDetails = [...this.allProductDetails].sort((a, b) => a.productDiscountedPrice - b.productDiscountedPrice);
    } else if (filter === 'highToLow') {
        this.productDetails = [...this.allProductDetails].sort((a, b) => b.productDiscountedPrice - a.productDiscountedPrice);
    } else if (filter === 'below10000') {
        this.productDetails = this.allProductDetails.filter(product => product.productDiscountedPrice < 10000);
    } else if (filter === 'between10000And20000') {
        this.productDetails = this.allProductDetails.filter(product => product.productDiscountedPrice >= 10000 && product.productDiscountedPrice <= 20000);
    } else if (filter === 'between20000And30000') {
        this.productDetails = this.allProductDetails.filter(product => product.productDiscountedPrice >= 20000 && product.productDiscountedPrice <= 30000);
    } else if (filter === 'above30000') {
        this.productDetails = this.allProductDetails.filter(product => product.productDiscountedPrice > 30000);
    }
}


  
  public isUser() {
    return this.userAuthService.isUser();
  }
  
}
