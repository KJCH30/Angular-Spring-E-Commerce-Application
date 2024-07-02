package com.techM.ecommerce.controller;

import com.techM.ecommerce.entity.OrderDetail;
import com.techM.ecommerce.entity.OrderInput;
import com.techM.ecommerce.entity.TransactionDetails;
import com.techM.ecommerce.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    @PreAuthorize("hasRole('User')")
    @PostMapping({"/placeOrder/{isSingleProductCheckout}"})
    public void placeOrder(@PathVariable(name = "isSingleProductCheckout") boolean isSingleProductCheckout,
                           @RequestBody OrderInput orderInput){
        orderDetailService.placeOrder(orderInput, isSingleProductCheckout);
    }

    @PreAuthorize("hasRole('User')")
    @GetMapping("/getOrderDetails")
    public List<OrderDetail> getOrderDetails(@RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size) {
        return orderDetailService.getOrderDetails(page, size);
    }

    @PreAuthorize("hasRole('User')")
    @GetMapping({"/createTransaction/{amount}"})
    public TransactionDetails createTransaction(@PathVariable(name = "amount") Double amount){
        return orderDetailService.createTransaction(amount);
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping({"/getAllOrderDetails"})
    public List<OrderDetail> getAllOrderDetails(){
        return orderDetailService.getAllOrderDetails();
    }

    @PreAuthorize("hasRole('Admin')")
    @GetMapping({"/markOrderAsDelivered/{orderId}"})
    public void markOrderAsDelivered(@PathVariable(name = "orderId") Integer orderId){
        orderDetailService.markOrderAsDelivered(orderId);
    }
}
