import { Component } from '@angular/core';
import { Product } from '../_model/product.model';
import { NgForm } from '@angular/forms';
import { ProductService } from '../_services/product.service';
import { response } from 'express';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { ImageHandle } from '../_model/image-handle.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrl: './add-new-product.component.css'
})
export class AddNewProductComponent {
  product: Product = {
    productName: "",
    productDescription: "",
    productDiscountedPrice: 0.0,
    productActualPrice: 0.0,
    productImages: []
  }

  constructor(private productService: ProductService,
    private sanitizer: DomSanitizer
  ){}
  addProduct(productForm: NgForm){
    const productFormData = this.prepareFormData(this.product)
    this.productService.addProduct(productFormData).subscribe({
      next: (response: Product)=>{
        console.log(response);
        productForm.reset()
      },
      error: (error: HttpErrorResponse)=>{
        console.log(error);
      }
    });
  }

  prepareFormData(product: Product):FormData{
    const formData = new FormData();

    formData.append(
      'product',
       new Blob([JSON.stringify(product)], {type: 'application/json'})
    )

    for(let i = 0; i < product.productImages.length; i++){
      formData.append(
        'imageFile', 
        product.productImages[i].image_file,
        product.productImages[i].image_file.name
      )
    }

    return formData;

  }

  handleFileInput(event : any){
    if(event.target.files){
      const file = event.target.files[0];

      const imageHandle : ImageHandle = {
        image_file : file,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        )
      }
      this.product.productImages.push(imageHandle);
    }
  }
}
