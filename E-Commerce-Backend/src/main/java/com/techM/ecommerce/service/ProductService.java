package com.techM.ecommerce.service;

import com.techM.ecommerce.configuration.JwtRequestFilter;
import com.techM.ecommerce.dao.CartDao;
import com.techM.ecommerce.dao.ProductDao;
import com.techM.ecommerce.dao.UserDao;
import com.techM.ecommerce.entity.Cart;
import com.techM.ecommerce.entity.Product;
import com.techM.ecommerce.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductDao productDao;
    @Autowired
    private UserDao userDao;

    @Autowired
    private CartDao cartDao;

    public Product addNewProduct(Product product){
        return productDao.save(product);
    }

    public List<Product> getAllProducts(int pageNumber, String searchKey, String filter) {
        if (filter != null && !filter.equals("none")) {
            List<Product> allProducts;
            if (searchKey.equals("")) {
                allProducts = applyPriceFilter(filter);
            } else {
                allProducts = applyPriceFilter(filter, searchKey);
            }
            return allProducts;
        } else {
            Pageable pageable = PageRequest.of(pageNumber, 8);
            return searchKey.equals("") ?
                    (List<Product>) productDao.findAll(pageable) :
                    productDao.findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(searchKey, searchKey, pageable);
        }
    }

    private List<Product> applyPriceFilter(String filter) {
        switch (filter) {
            case "below10000":
                return productDao.findByProductDiscountedPriceLessThan(10000);
            case "between10000And20000":
                return productDao.findByProductDiscountedPriceBetween(10000, 20000);
            case "between20000And30000":
                return productDao.findByProductDiscountedPriceBetween(20000, 30000);
            case "above30000":
                return productDao.findByProductDiscountedPriceGreaterThan(30000);
            default:
                return (List<Product>) productDao.findAll();
        }
    }

    private List<Product> applyPriceFilter(String filter, String searchKey) {
        switch (filter) {
            case "below10000":
                return productDao.findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCaseAndProductDiscountedPriceLessThan(searchKey, searchKey, 10000);
            case "between10000And20000":
                return productDao.findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCaseAndProductDiscountedPriceBetween(searchKey, searchKey, 10000, 20000);
            case "between20000And30000":
                return productDao.findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCaseAndProductDiscountedPriceBetween(searchKey, searchKey, 20000, 30000);
            case "above30000":
                return productDao.findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCaseAndProductDiscountedPriceGreaterThan(searchKey, searchKey, 30000);
            default:
                return productDao.findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(searchKey, searchKey);
        }
    }


    public void deleteProductDetails(Integer productId){
        productDao.deleteById(productId);
    }

    public Product getProductDetailsById(Integer productId){
       return productDao.findById(productId).get();
    }

    public List<Product> getProductDetails(boolean isSingleProductCheckout, Integer productId){
        if (isSingleProductCheckout && productId != 0) {
            // we are going to buy a single product

            List<Product> list = new ArrayList<>();
            Product product = productDao.findById(productId).get();
            list.add(product);
            return list;
        }else {
            // we are going to checkout entire cart
            String username = JwtRequestFilter.CURRENT_USER;
            User user  = userDao.findById(username).get();
            List<Cart> carts = cartDao.findByUser(user);

           return carts.stream().map(x -> x.getProduct()).collect(Collectors.toList());
        }
     }
}
