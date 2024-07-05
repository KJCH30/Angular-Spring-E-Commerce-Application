import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { MyOrderDetails } from '../_model/all-orders.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  displayedColumns = ["Name", "Address", "Contact Number", "Amount Paid", "Status"];
  myOrderDetails: MyOrderDetails[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;
  length: number = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getMyOrders();
  }

  getMyOrders(): void {
    this.productService.getOrderDetails(this.pageIndex, this.pageSize).subscribe({
      next: (resp: MyOrderDetails[]) => {
        this.myOrderDetails = resp;
        this.length = 30
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getMyOrders();
  }
}
