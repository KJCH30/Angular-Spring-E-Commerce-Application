package com.techM.ecommerce.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.techM.ecommerce.configuration.JwtRequestFilter;
import com.techM.ecommerce.dao.CartDao;
import com.techM.ecommerce.dao.OrderDetailDao;
import com.techM.ecommerce.dao.ProductDao;
import com.techM.ecommerce.dao.UserDao;
import com.techM.ecommerce.entity.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderDetailService {
    private static final String ORDER_PLACED = "Placed";
    private static final String KEY = "rzp_test_00p7x0b1xTiKDq";
    private static final String KEY_SECRET = "qaDWkgREx1y1XYWkHnDe97km";
    private static final String CURRENCY = "INR";


    @Autowired
    private UserDao userDao;
    @Autowired
    private OrderDetailDao orderDetailDao;
    @Autowired
    private ProductDao productDao;
    @Autowired
    private CartDao cartDao;

    public List<OrderDetail> getAllOrderDetails(String status){
        List<OrderDetail> orderDetails = new ArrayList<>();

        if (status.equals("All")){
            orderDetailDao.findAll().forEach(
                    order -> orderDetails.add(order)
            );
        }else{
            orderDetailDao.findByOrderStatus(status).forEach(
                    order -> orderDetails.add(order)
            );
        }

        return orderDetails;
    }
    public void placeOrder(OrderInput orderInput, boolean isSingleProductCheckout){
        List<OrderProductQuantity> productQuantityList = orderInput.getOrderProductQuantityList();
        String currentUser = JwtRequestFilter.CURRENT_USER;
        User user = userDao.findById(currentUser).orElseThrow(() -> new RuntimeException("User not found"));

        for (OrderProductQuantity o : productQuantityList){
            Product product = productDao.findById(o.getProductId()).orElseThrow(() -> new RuntimeException("Product not found"));
            OrderDetail orderDetail = new OrderDetail(
                    orderInput.getFullName(),
                    orderInput.getFullAddress(),
                    orderInput.getContactNumber(),
                    orderInput.getAlternateContactNumber(),
                    ORDER_PLACED,
                    product.getProductDiscountedPrice() * o.getQuantity(),
                    product,
                    user,
                    orderInput.getTransactionId()
            );
            orderDetailDao.save(orderDetail);
        }
        // Empty the cart if not a single product checkout
        if (!isSingleProductCheckout){
            List<Cart> carts = cartDao.findByUser(user);
            carts.forEach(cart -> cartDao.deleteById(cart.getCartId()));
        }
    }

    public void markOrderAsDelivered(Integer orderId){
        OrderDetail orderDetail = orderDetailDao.findById(orderId).get();
        if (orderDetail != null){
            orderDetail.setOrderStatus("Delivered");
            orderDetailDao.save(orderDetail);
        }
    }

    public List<OrderDetail> getOrderDetails(int page, int size){
        String currentUser = JwtRequestFilter.CURRENT_USER;
        User user = userDao.findById(currentUser).orElse(null);
        Pageable pageable = PageRequest.of(page, size);
        return orderDetailDao.findByUser(user, pageable);
    }



    public TransactionDetails createTransaction(Double amount){
        //amount
        //currency
        //key
        //secret key
        //These are required to create razorpay payment gateway
        //Razorpay considers smallest unit of a currency that's why we need to multiply with 100
        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("amount", (amount * 100));
            jsonObject.put("currency", CURRENCY);

            RazorpayClient razorpayClient = new RazorpayClient(KEY, KEY_SECRET);
            Order order =  razorpayClient.orders.create(jsonObject);
            return prepareTransactionDetails(order);
        }catch (Exception e){
            System.out.printf(e.getMessage());
        }
        return null;
    }

    public TransactionDetails prepareTransactionDetails(Order order){
        String orderId = order.get("id");
        String currency = order.get("currency");
        Integer amount = order.get("amount");

        TransactionDetails transactionDetails = new TransactionDetails(orderId, currency, amount, KEY);
        return transactionDetails;
    }
}