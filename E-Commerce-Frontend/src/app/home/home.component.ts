import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../_model/product.model';
import { ImageProcessingService } from '../_services/image-processing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  productDetails: Product[] = [];

  constructor(private productService : ProductService,
    private imageProcessingService: ImageProcessingService,
    private router: Router
  ){}
  ngOnInit(): void {
    this.getAllProducts()
  }

  public getAllProducts() {
    this.productService.getAllProducts()
    .pipe(
      map((x: Product[], i:any) => x.map((product: Product) => this.imageProcessingService.createImages(product)))
    )
    .subscribe({
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

  public showProductDetails(productId : any){
    this.router.navigate(['/productViewDetails', {productId: productId}])
  }

}
