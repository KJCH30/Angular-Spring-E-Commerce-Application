import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from './product.service';
import { map } from 'rxjs';
import { ImageProcessingService } from './image-processing.service';

@Injectable({
  providedIn: 'root'
})
export class BuyProductResolverService implements Resolve<Product[]>{


  constructor(private productService: ProductService,
    private imageProcessingService: ImageProcessingService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<Product[]> {
    const id = route.queryParamMap.get("id");
    const isSingleProductCheckout = route.queryParamMap.get("isSingleProductCheckout") === 'true';
    return this.productService.getProductDetails(isSingleProductCheckout, id)
      .pipe(
        map(
          (products: Product[]) => products.map((product: Product) => this.imageProcessingService.createImages(product))
        )
      );
  }
  
}
