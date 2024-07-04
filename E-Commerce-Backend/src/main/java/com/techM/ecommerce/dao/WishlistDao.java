package com.techM.ecommerce.dao;

import com.techM.ecommerce.entity.User;
import com.techM.ecommerce.entity.Wishlist;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistDao extends CrudRepository<Wishlist, Integer> {
    public List<Wishlist> findByUser(User user);
}
