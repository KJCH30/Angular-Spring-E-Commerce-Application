import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { error } from 'console';
import { MyOrderDetails } from '../_model/all-orders.model';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {
  displayedColumns = ["Name", "Address", "Contact Number", "Amount Paid", "Status"]
  myOrderDetails: MyOrderDetails[] = []

  constructor(private productService: ProductService){}
  ngOnInit(): void {
    this.getMyOrders()
  }

  getMyOrders(){
    this.productService.getOrderDetails().subscribe({
      next: (resp: MyOrderDetails[]) => {
        console.log(resp);
        this.myOrderDetails = resp
      },
      error: (error)=>{
        console.log(error);
      }
    })
  }
}
