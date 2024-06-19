import { Component, OnInit } from '@angular/core';
import { Product } from '../_model/product.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-view-details',
  templateUrl: './product-view-details.component.html',
  styleUrl: './product-view-details.component.css'
})
export class ProductViewDetailsComponent implements OnInit{

  selectedImage = 0
  product!: Product;
  constructor(private activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.product = this.activatedRoute.snapshot.data['product']
    console.log(this.product);
    
  }

  changeImage(index : any){
    this.selectedImage = index
  }

}
