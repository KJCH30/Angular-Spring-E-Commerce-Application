import { Component, OnInit } from '@angular/core';
import { Product } from '../_model/product.model';
import { NgForm } from '@angular/forms';
import { ProductService } from '../_services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageHandle } from '../_model/image-handle.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.css']
})
export class AddNewProductComponent implements OnInit{
  isNewProduct = true;

  product: Product = {
    productId: 0,
    productName: "",
    productDescription: "",
    productDiscountedPrice: 0.0,
    productActualPrice: 0.0,
    productImages: []
  };

  errorMessage: string = '';

  constructor(private productService: ProductService,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute
  ){}
  ngOnInit(): void {
    this.product =  this.activatedRoute.snapshot.data['product']

    if(this.product && this.product.productId){
      this.isNewProduct = false;
    }
  }

  addProduct(productForm: NgForm){
    const productFormData = this.prepareFormData(this.product);
    this.productService.addProduct(productFormData).subscribe({
      next: (response: Product) => {
        console.log(response);
        productForm.reset();
        this.product.productImages = [];
        this.errorMessage = ''; // Clear the error message on success
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 417) { // Expectation Failed status
          this.errorMessage = 'File too large!';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      }
    });
  }

  prepareFormData(product: Product): FormData {
    const formData = new FormData();

    formData.append(
      'product',
       new Blob([JSON.stringify(product)], {type: 'application/json'})
    );

    for(let i = 0; i < product.productImages.length; i++){
      formData.append(
        'imageFile', 
        product.productImages[i].image_file,
        product.productImages[i].image_file.name
      );
    }

    return formData;
  }

  handleFileInput(event: any) {
    if (event.target.files) {
      const file = event.target.files[0];

      const imageHandle: ImageHandle = {
        image_file: file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        )
      };
      this.product.productImages.push(imageHandle);
    }
  }

  removeImages(i: number) {
    this.product.productImages.splice(i, 1);
  }

  fileDropped(imageHandle: ImageHandle) {
    this.product.productImages.push(imageHandle);
  }
}
