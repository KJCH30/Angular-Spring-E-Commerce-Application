package com.techM.ecommerce.controller;

import com.techM.ecommerce.entity.Wishlist;
import com.techM.ecommerce.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
public class WishlistController {

    @Autowired
    WishlistService wishlistService;

    @PreAuthorize("hasRole('User')")
    @GetMapping({"/addToWishlist/{productId}"})
    public Wishlist addToWishlist(@PathVariable(name = "productId") Integer productId){
        return wishlistService.addToWishlist(productId);
    }

    @PreAuthorize("hasRole('User')")
    @DeleteMapping("/deleteWishlistItem/{wishlistId}")
    public void deleteWishlistItem(@PathVariable(name = "wishlistId") Integer wishlistId){
        wishlistService.deleteWishlistItem(wishlistId);
    }

    @PreAuthorize("hasRole('User')")
    @GetMapping({"/getWishlistDetails"})
    public List<Wishlist> getWishlistDetails(){
        return wishlistService.getWishlistDetails();
    }

    @PreAuthorize("hasRole('User')")
    @GetMapping("/isProductInWishlist/{productId}")
    public boolean isProductInWishlist(@PathVariable(name = "productId") Integer productId) {
        return wishlistService.isProductInWishlist(productId);
    }
}
