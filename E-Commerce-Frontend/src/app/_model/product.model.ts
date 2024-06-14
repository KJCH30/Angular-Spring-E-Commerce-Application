import { ImageHandle } from "./image-handle.model";

export interface Product{
    productName: string,
    productDescription: string,
    productDiscountedPrice: number,
    productActualPrice: number,
    productImages: ImageHandle[]
}