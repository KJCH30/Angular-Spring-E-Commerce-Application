import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot } from '@angular/router';
import { Product } from '../_model/product.model';
import { Observable, map, of } from 'rxjs';
import { ProductService } from './product.service';
import { ImageProcessingService } from './image-processing.service';

@Injectable({
  providedIn: 'root'
})
export class ProductResolveService implements Resolve<Product> {

  constructor(private productService: ProductService,
    private imageProccesingService : ImageProcessingService
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const id = route.paramMap.get("productId")

    if (id) {
      //then it is fine to fetch details
      return this.productService.getProductDetailsById(id)
      .pipe(
        map(p => this.imageProccesingService.createImages(p))
      );
 
    } else {
      //if no id then return empty product
      return of (this.getProductDetails())
    }
  }

  getProductDetails() {
    return {
      productId: 0,
      productName: "",
      productDescription: "",
      productDiscountedPrice: 0.0,
      productActualPrice: 0.0,
      productImages: []
    };
  }
}

