package com.techM.ecommerce.dao;

import com.techM.ecommerce.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDao extends CrudRepository<Product, Integer>{
    List<Product> findAll(Pageable pageable);
    List<Product> findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(String key1, String key2, Pageable pageable);

    // Non-paginated search methods
    List<Product> findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(String key1, String key2);

    // Non-paginated methods for price filtering
    List<Product> findByProductDiscountedPriceLessThan(int price);
    List<Product> findByProductDiscountedPriceBetween(int minPrice, int maxPrice);
    List<Product> findByProductDiscountedPriceGreaterThan(int price);

    // Combined search and price filters
    List<Product> findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCaseAndProductDiscountedPriceLessThan(String key1, String key2, int price);
    List<Product> findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCaseAndProductDiscountedPriceBetween(String key1, String key2, int minPrice, int maxPrice);
    List<Product> findByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCaseAndProductDiscountedPriceGreaterThan(String key1, String key2, int price);
}
