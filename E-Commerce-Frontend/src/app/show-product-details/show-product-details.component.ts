import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../_model/product.model';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrl: './show-product-details.component.css'
})
export class ShowProductDetailsComponent implements OnInit {
  productDetails: Product[] = []

  displayedColumns: string[] = ['Id', 'Product Name', 'Product Description',
    'Product Discounted Price', 'Product Actual Price', 'Edit', 'Delete'];
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  public getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (resp: Product[]) => {
        console.log(resp);
        this.productDetails = resp;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    }

    )
  }

  deleteProduct(productId: any) {
    this.productService.deleteProduct(productId).subscribe({
      next: (resp: any) => {
        this.getAllProducts()
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    }
    )
  }
}
