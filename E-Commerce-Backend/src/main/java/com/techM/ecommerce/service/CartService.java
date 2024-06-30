package com.techM.ecommerce.service;

import com.techM.ecommerce.configuration.JwtRequestFilter;
import com.techM.ecommerce.dao.CartDao;
import com.techM.ecommerce.dao.ProductDao;
import com.techM.ecommerce.dao.UserDao;
import com.techM.ecommerce.entity.Cart;
import com.techM.ecommerce.entity.Product;
import com.techM.ecommerce.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class CartService {
    @Autowired
    private CartDao cartDao;
    @Autowired
    private ProductDao productDao;
    @Autowired
    private UserDao userDao;
    public Cart addToCart(Integer productId){
        Product product = productDao.findById(productId).get();
        String username = JwtRequestFilter.CURRENT_USER;
        User user = null;
        if (username != null){
            user = userDao.findById(username).get();
        }

        List<Cart> cartList =  cartDao.findByUser(user);
        List<Cart> filteredList = cartList.stream().filter(cart -> Objects.equals(cart.getProduct().getProductId(), productId)).toList();

        if (!filteredList.isEmpty()){
            return null;
        }
        if (user != null){
            Cart cart = new Cart(product, user);
            return cartDao.save(cart);
        }
        return  null;
    }

    public List<Cart> getCartDetails(){
        String username = JwtRequestFilter.CURRENT_USER;
        User user = userDao.findById(username).get();
        return cartDao.findByUser(user);
    }

    public void deleteCartItem(Integer cartId){
        cartDao.deleteById(cartId);
    }
}
