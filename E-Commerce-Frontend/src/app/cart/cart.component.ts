import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { error } from 'console';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  displayedColumns: string[] = ['Product Name', 'Description', 'Price', 'Discounted Price', 'Action'];
  cartDetails = []

  constructor(private productService: ProductService,
    private router: Router,
    private cartService: CartService  
  ) { }
  ngOnInit(): void {
    this.getCartDetails()
  }

  getCartDetails(){
    this.productService.getCartDetails().subscribe({
      next: (response: any) => {
        console.log(response)
        this.cartDetails = response
        this.cartService.updateCartCount(this.cartDetails.length);
      },
      error: (error) =>{
        console.log(error);    
      }
    })
  }

  checkout(){

    this.router.navigate(['/buyProduct'], {
      queryParams: {
        isSingleProductCheckout: true,
        id: 0
      }
    });

    // this.productService.getProductDetails(false, 0).subscribe({
    //   next: (response: any) => {
    //     console.log(response)
    //   },
    //   error: (error)=>{
    //     console.log(error);
        
    //   }
    // })
  }

  delete(cartId: number): void {
    console.log(cartId);
    this.productService.deleteCartItem(cartId).subscribe({
      next: (response) => {
        console.log(response);
        this.getCartDetails();
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
