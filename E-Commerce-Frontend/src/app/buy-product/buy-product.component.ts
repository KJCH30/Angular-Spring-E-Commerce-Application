import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderDetails } from '../_model/order-details.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrl: './buy-product.component.css'
})
export class BuyProductComponent {

  isSingleProductCheckout!: boolean;
  productId!: any;

  productDetails: Product[] = [];
  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router

  ) { }


  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    orderProductQuantityList: []
  }

  ngOnInit(): void {
    this.productDetails =  this.activatedRoute.snapshot.data['productDetails'];

    this.activatedRoute.queryParams.subscribe(params => {
      this.isSingleProductCheckout = params['isSingleProductCheckout'] === 'true';
      this.productId = params['id'];
    });

    this.productDetails.forEach(
      x => this.orderDetails.orderProductQuantityList.push(
        {
          productId : x.productId,
          quantity: 1
        }
      )
    )
    console.log(this.productDetails);
    console.log(this.orderDetails);
    
    
  }

  public placeOrder(orderForm: NgForm){
    this.productService.placeOrder(this.orderDetails).subscribe({
      next: (resp) =>{
        console.log(resp);
        orderForm.reset();
        this.router.navigate(["/orderConfirmed"])
      },
      error: (err) =>{
        console.log(err);
      }
    })
  }

  getQuantityForProduct(productId: any){
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    )
    return filteredProduct[0].quantity
  }

  getCalculatedTotal(productId:any, productDiscountedPrice:any){
    const quantity = this.getQuantityForProduct(productId)
    
    return quantity * productDiscountedPrice;
  }

  onQuantityChanged(quantity : any, productId : any){
    this.orderDetails.orderProductQuantityList.filter(
      (orderProduct) => orderProduct.productId === productId
    )[0].quantity = quantity;
  }

  getCalculatedGrandTotal(){
    let grandTotal = 0;
    this.orderDetails.orderProductQuantityList.forEach(
      (productQuantity) => {
       const price =  this.productDetails.filter(product => product.productId === productQuantity.productId)[0].productDiscountedPrice
       grandTotal += productQuantity.quantity * price
      }
    )
    return grandTotal
  }
 
}
