package com.techM.ecommerce.entity;

import jakarta.persistence.*;

@Entity
@Table
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer wishlistId;
    @OneToOne
    private Product product;
    @OneToOne
    private User user;

    public Wishlist(){

    }
    public Wishlist(Product product, User user) {
        this.product = product;
        this.user = user;
    }

    public Integer getWishlistId() {
        return wishlistId;
    }

    public void setWishlistId(Integer wishlistId) {
        this.wishlistId = wishlistId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
