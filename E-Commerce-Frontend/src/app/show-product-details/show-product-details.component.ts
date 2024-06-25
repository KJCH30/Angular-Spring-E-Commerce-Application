import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../_model/product.model';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImagesDialogComponent } from '../show-product-images-dialog/show-product-images-dialog.component';
import { ImageProcessingService } from '../_services/image-processing.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrl: './show-product-details.component.css'
})
export class ShowProductDetailsComponent implements OnInit {
  showLoadButton = false;
  pageNumber :number = 0
  showTable = false

  productDetails: Product[] = []

  displayedColumns: string[] = ['Id', 'Product Name', 'description',
    'Product Discounted Price', 'Product Actual Price', 'Actions'];
  constructor(private productService: ProductService,
    public imagesDialog: MatDialog,
    private imageProcessingService: ImageProcessingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  public getAllProducts() {
    this.showTable = false
    this.productService.getAllProducts(this.pageNumber)
    .pipe(
      map((x: Product[], i:any) => x.map((product: Product) => this.imageProcessingService.createImages(product)))
    )
    .subscribe({
      next: (resp: Product[]) => {
        console.log(resp);
    
        resp.forEach(product => this.productDetails.push(product))
        this.showTable = true

        if(resp.length == 4){
          this.showLoadButton = true
        }else{
          this.showLoadButton = false
        }
        
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

  showImages(product: Product){
    console.log(product);
    this.imagesDialog.open(ShowProductImagesDialogComponent, {
      data:{
        images: product.productImages
      },
      height: '500px',
      width: '800px'
    })
  }

  editProductDetails(productId: any){
    this.router.navigate(['/addNewProduct', {productId: productId}])
  }

  public loadMoreProduct(){
    this.pageNumber += 1
    this.getAllProducts()
  }
}
