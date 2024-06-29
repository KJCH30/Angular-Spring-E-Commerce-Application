import { ImageHandle } from "./image-handle.model";

export interface Product{
    productId: number,
    productName: string,
    productDescription: string,
    productDiscountedPrice: number,
    productActualPrice: number,
    productImages: ImageHandle[]
    isWishlisted?: boolean;
    isAddedToCart?: boolean;
    
}