import { Component, OnInit } from '@angular/core';
import { Product } from '../_model/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../_services/product.service';
import { CartService } from '../cart.service';
import { UserAuthService } from '../_services/user-auth.service';

@Component({
  selector: 'app-product-view-details',
  templateUrl: './product-view-details.component.html',
  styleUrl: './product-view-details.component.css'
})
export class ProductViewDetailsComponent implements OnInit {

  selectedImage = 0
  product!: Product;
  cartStatus = false;
  warning = false;
  productDetails: Product[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private userAuthService: UserAuthService
  ) { }
  ngOnInit(): void {
    this.product = this.activatedRoute.snapshot.data['product']
    console.log(this.product);

  }

  addToCart(productId: number) {
    this.productService.addToCart(productId).subscribe({
      next: (response) => {
        console.log(response);
        if (response) {  // Check if cartId is present in response
          this.cartService.incrementCartCount();
          const product = this.productDetails.find(p => p.productId === productId);
          if (product) {
            product.isAddedToCart = true;
            
          }
          this.cartStatus = true;
          setTimeout(() => {
            this.cartStatus = false;
          }, 3000); // Reset the status after 3 seconds
        }else {
          // Display warning message if response is null
          this.warning = true;
          setTimeout(() => {
            this.warning = false;
          }, 3000)
        }
      },

      error: (error) => {
        console.log(error);
      }

    })
  }

  changeImage(index: number) {
    if (index >= 0 && index < this.product.productImages.length) {
      this.selectedImage = index;
    } else if (index < 0) {
      this.selectedImage = this.product.productImages.length - 1;
    } else {
      this.selectedImage = 0;
    }
  }

  buyProduct(productId: any) {
    if(this.userAuthService.isUser()){
      this.router.navigate(['/buyProduct'], {
        queryParams: {
          isSingleProductCheckout: true,
          id: productId
        }
      });
    }
    else{
      this.router.navigate(['/login']);
    }
  }
}
