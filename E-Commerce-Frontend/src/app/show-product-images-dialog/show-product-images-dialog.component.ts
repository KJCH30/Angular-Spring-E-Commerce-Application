import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { ImageHandle } from '../_model/image-handle.model';
@Component({
  selector: 'app-show-product-images-dialog',
  templateUrl: './show-product-images-dialog.component.html',
  styleUrl: './show-product-images-dialog.component.css'
})
export class ShowProductImagesDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void{
    this.receiveImages();
  }
  receiveImages(){
    console.log(this.data);
    
  }
}
