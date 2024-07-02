import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  animations: [
    trigger('tickAnimation', [
      state('placed', style({})),
      state('delivered', style({
        backgroundColor: 'green',
        color: 'white',
        border: '2px solid green',
      })),
      transition('placed => delivered', [
        animate('0.3s', style({ transform: 'scale(1.1)' })),
        animate('0.2s', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class OrderDetailsComponent implements OnInit {
  displayedColumns: string[] = ['Id', 'Product Name', 'Name', 'Address', 'Contact No.', 'Status', 'Action'];
  dataSource = [];
  tickStates : any = {};
  status: string = 'All';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllOrderDetailsForAdmin(this.status);
  }

  getAllOrderDetailsForAdmin(statusParam : string): void {
    this.productService.getAllOrderDetailsForAdmin(statusParam).subscribe({
      next: (response: any) => {
        this.dataSource = response;
        response.forEach((order: any) => {
          this.tickStates[order.orderId] = 'placed';
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updateOrderStatus(orderId: number): void {
    this.productService.markOrderAsDelivered(orderId).subscribe({
      next: (response: any) => {
        console.log(response)
        this.tickStates[orderId] = 'delivered';
        setTimeout(() => {
          this.getAllOrderDetailsForAdmin(this.status);
        }, 500);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  triggerTickAnimation(orderId: number) {
    this.tickStates[orderId] = 'completed';
    setTimeout(() => {
      this.tickStates[orderId] = 'default';
    }, 500); // Reset the state after animation
  }
}
