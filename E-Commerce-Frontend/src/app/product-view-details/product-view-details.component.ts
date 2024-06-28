import { Component, OnInit } from '@angular/core';
import { Product } from '../_model/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../_services/product.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-product-view-details',
  templateUrl: './product-view-details.component.html',
  styleUrl: './product-view-details.component.css'
})
export class ProductViewDetailsComponent implements OnInit{

  selectedImage = 0
  product!: Product;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService 
  ) { }
  ngOnInit(): void {
    this.product = this.activatedRoute.snapshot.data['product']
    console.log(this.product);
    
  }

  addToCart(productId : number){
    this.productService.addToCart(productId).subscribe({
      next: (response) =>{
        console.log(response);
        if (response) {  // Check if cartId is present in response
          this.cartService.incrementCartCount();
        }
      },

      error: (error) =>{
        console.log(error);
      }

    })    
  }

  changeImage(index : any){
    this.selectedImage = index
  }

  buyProduct(productId: any) {
    this.router.navigate(['/buyProduct'], {
      queryParams: {
        isSingleProductCheckout: true,
        id: productId
      }
    });
  }
  
}
