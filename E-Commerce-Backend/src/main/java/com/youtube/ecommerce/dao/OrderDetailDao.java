package com.youtube.ecommerce.dao;

import com.youtube.ecommerce.entity.OrderDetail;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailDao extends CrudRepository<OrderDetail, Integer> {
}
