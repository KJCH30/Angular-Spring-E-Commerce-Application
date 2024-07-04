import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  displayedColumns: string[] = ['Product Name', 'Description', 'Price', 'Discounted Price', 'Action'];
  cartDetails: any[] = [];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getCartDetails();
  }

  getCartDetails() {
    this.productService.getCartDetails().subscribe({
      next: (response: any) => {
        console.log(response);
        this.cartDetails = response;
        this.dataSource.data = this.cartDetails;
        this.cartService.updateCartCount(this.cartDetails.length);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  checkout() {
    this.router.navigate(['/buyProduct'], {
      queryParams: {
        isSingleProductCheckout: true,
        id: 0
      }
    });
  }

  delete(cartId: number): void {
    console.log(cartId);
    this.productService.deleteCartItem(cartId).subscribe({
      next: (response) => {
        console.log(response);
        this.getCartDetails();
        this.cartService.decrementCartCount();
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
