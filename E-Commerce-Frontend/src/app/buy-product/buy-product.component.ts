import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderDetails } from '../_model/order-details.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { CartService } from '../cart.service';
// import * as Razorpay from 'razorpay';

declare var Razorpay: any;
@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrl: './buy-product.component.css'
})
export class BuyProductComponent {

  isSingleProductCheckout: string = '';
  productId!: any;

  productDetails: Product[] = [];
  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService

  ) { }


  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    transactionId: '',
    orderProductQuantityList: []
  }

  ngOnInit(): void {
    this.productDetails =  this.activatedRoute.snapshot.data['productDetails'];
    this.isSingleProductCheckout = this.activatedRoute.snapshot.paramMap.get("isSingleProductCheckout") ?? ''

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
    const isCartCheckout = this.isSingleProductCheckout === 'true';
    this.productService.placeOrder(this.orderDetails, isCartCheckout).subscribe({
      next: (resp) =>{
        console.log(resp);
        orderForm.reset();
        this.router.navigate(["/orderConfirmed"])
        this.cartService.updateCartCount(0)
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

  createTransactionAndPlaceOrder(orderForm : NgForm){
    let amount = this.getCalculatedGrandTotal();
    this.productService.createTransaction(amount).subscribe({
      next: (resp) =>{
        console.log(resp);
        this.openTransactionModal(resp, orderForm)
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  openTransactionModal(response: any, orderForm : NgForm){
    let options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'Simply-Cart',
      description: 'Payment for placing your Order',
      image: 'https://cdn.pixabay.com/photo/2024/04/05/05/16/e-commerce-8676517_1280.jpg',
      handler: (response: any) =>{
        if(response != null && response.razorpay_payment_id != null){
          this.processResponse(response, orderForm);

        }else{
          alert("Payment has Failed")
        }
      },
      prefill: {
        name: 'Jish',
        email: 'jish@gmail.com',
        contact: '9807616221'
      },
      notes:{
        address: 'Rajbiraj, Saptari'
      },
      theme: {
        color: '#3399cc'
      }
    }
    let razorPayObject = new Razorpay(options);
    razorPayObject.open();
  }

  processResponse(resp: any, orderForm : NgForm){
    this.orderDetails.transactionId = resp.razorpay_payment_id;
    this.placeOrder(orderForm)
  }
}
