import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.css'
})
export class VendorComponent implements OnInit{
  message : any;
  constructor(private userService: UserService){}

  ngOnInit(): void{
    this.forVendor()
  }

  forVendor(){
    this.userService.forVendor().subscribe({
      next:
      (response) =>{
        console.log(response)
        this.message = response;
      },
      error:(error) =>{
        console.log(error)
      }
    }
    );
  }
}
