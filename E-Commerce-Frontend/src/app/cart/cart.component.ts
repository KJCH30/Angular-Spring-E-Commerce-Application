import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  displayedColumns: string[] = ['Product Name', 'Description', 'Price', 'Discounted Price', 'Action'];
  cartDetails = []

  constructor(private productService: ProductService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.getCartDetails()
  }

  getCartDetails(){
    this.productService.getCartDetails().subscribe({
      next: (response: any) => {
        console.log(response)
        this.cartDetails = response
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
}
