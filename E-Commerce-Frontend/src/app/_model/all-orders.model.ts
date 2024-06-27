import { Product } from "./product.model";

export interface MyOrderDetails{
    orderId: number,
    orderFullName: string,
    orderAddress: string,
    orderContactNumber: string,
    orderAlternateContactNumber: string,
    orderStatus: string,
    orderAmount: number,
    product: Product,
    user: any

}