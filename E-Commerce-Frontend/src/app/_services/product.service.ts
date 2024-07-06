import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../_model/product.model';
import { OrderDetails } from '../_model/order-details.model';
import { MyOrderDetails } from '../_model/all-orders.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  public addProduct(product: FormData){
    return this.httpClient.post<Product>("http://localhost:9090/addNewProduct", product)
  } 

  public getAllProducts(pageNumber: number, searchKey: string, filter: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`http://localhost:9090/getAllProducts`, {
      params: {
        pageNumber: pageNumber.toString(),
        searchKey: searchKey,
        filter: filter
      }
    });
  }

  public deleteProduct(productId: number){
    return this.httpClient.delete("http://localhost:9090/deleteProductDetails/"+productId)
  }

  public getProductDetailsById(productId: any){
    return this.httpClient.get<Product>("http://localhost:9090/getProductDetailsById/"+productId)
  }

  public getProductDetails(isSingleProductCheckout: any, productId: any){
    return this.httpClient.get<Product[]>("http://localhost:9090/getProductDetails/"+isSingleProductCheckout + "/" + productId)
  }

  public placeOrder(orderDetails: OrderDetails, isCartCheckout: boolean) {
    return this.httpClient.post(`http://localhost:9090/placeOrder/${isCartCheckout}`, orderDetails);
}

  public addToCart(productId : number){
    return this.httpClient.get("http://localhost:9090/addToCart/"+productId)
  }

  public getCartDetails(){
    return this.httpClient.get("http://localhost:9090/getCartDetails")
  }

  public deleteCartItem(cartId: number){
    return this.httpClient.delete(`http://localhost:9090/deleteCartItem/${cartId}`);
  }

  public addToWishlist(productId : number){
    return this.httpClient.get("http://localhost:9090/addToWishlist/"+productId)
  }

  public getWishlistDetails(): Observable<any[]> {
    return this.httpClient.get<any[]>("http://localhost:9090/getWishlistDetails");
  }
  

  public deleteWishlistItem(wishlistId: number){
    return this.httpClient.delete(`http://localhost:9090/deleteWishlistItem/${wishlistId}`);
  }

  public isProductInWishlist(productId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`http://localhost:9090/isProductInWishlist/${productId}`);
  }
  

  public getOrderDetails(page: number, size: number): Observable<any> {
    return this.httpClient.get<any>(`http://localhost:9090/getOrderDetails?page=${page}&size=${size}`);
  }
  
public getAllOrderDetailsForAdmin(status : string): Observable<MyOrderDetails[]> {
  return this.httpClient.get<MyOrderDetails[]>(`http://localhost:9090/getAllOrderDetails/${status}`);
}

  public createTransaction(amount : number){
    return this.httpClient.get("http://localhost:9090/createTransaction/"+ amount)
  }

  public markOrderAsDelivered(orderId : number){
    return this.httpClient.get("http://localhost:9090/markOrderAsDelivered/"+ orderId)
  }
}
