package com.youtube.ecommerce.dao;

import com.youtube.ecommerce.entity.OrderDetail;
import com.youtube.ecommerce.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailDao extends CrudRepository<OrderDetail, Integer> {
    List<OrderDetail> findByUser(User user, Pageable pageable);
}
