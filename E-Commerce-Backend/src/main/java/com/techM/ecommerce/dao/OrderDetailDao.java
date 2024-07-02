package com.techM.ecommerce.dao;

import com.techM.ecommerce.entity.OrderDetail;
import com.techM.ecommerce.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailDao extends CrudRepository<OrderDetail, Integer> {
    public List<OrderDetail> findByUser(User user, Pageable pageable);

    public List<OrderDetail> findByOrderStatus(String status);

}
