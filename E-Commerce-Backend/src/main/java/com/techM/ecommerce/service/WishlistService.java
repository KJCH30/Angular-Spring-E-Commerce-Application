package com.techM.ecommerce.service;

import com.techM.ecommerce.configuration.JwtRequestFilter;
import com.techM.ecommerce.dao.ProductDao;
import com.techM.ecommerce.dao.UserDao;
import com.techM.ecommerce.dao.WishlistDao;
import com.techM.ecommerce.entity.Product;
import com.techM.ecommerce.entity.User;
import com.techM.ecommerce.entity.Wishlist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class WishlistService {
    @Autowired
    private WishlistDao wishlistDao;
    @Autowired
    private ProductDao productDao;
    @Autowired
    private UserDao userDao;

    public Wishlist addToWishlist(Integer productId) {
        Product product = productDao.findById(productId).get();
        String username = JwtRequestFilter.CURRENT_USER;
        User user = null;
        if (username != null) {
            user = userDao.findById(username).get();
        }
        List<Wishlist> wishlists = wishlistDao.findByUser(user);
        List<Wishlist> filteredList = wishlists.stream().filter(wishlist -> Objects.equals(wishlist.getProduct().getProductId(), productId)).toList();

        if (!filteredList.isEmpty()) {
            return filteredList.get(0); // Return the existing wishlist item if it exists
        }

        if (user != null) {
            Wishlist wishlist = new Wishlist(product, user);
            return wishlistDao.save(wishlist);
        }
        return null;
    }


    public void deleteWishlistItem(Integer wishlistId) {
        wishlistDao.deleteById(wishlistId);
    }

    public List<Wishlist> getWishlistDetails() {
        String username = JwtRequestFilter.CURRENT_USER;
        User user = userDao.findById(username).get();
        return wishlistDao.findByUser(user);
    }

    public boolean isProductInWishlist(Integer productId) {
        String username = JwtRequestFilter.CURRENT_USER;
        User user = userDao.findById(username).get();
        List<Wishlist> wishlists = wishlistDao.findByUser(user);
        return wishlists.stream().anyMatch(wishlist -> Objects.equals(wishlist.getProduct().getProductId(), productId));
    }
}
