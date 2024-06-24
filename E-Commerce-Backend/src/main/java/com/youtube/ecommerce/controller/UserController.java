package com.youtube.ecommerce.controller;


import com.youtube.ecommerce.entity.User;
import com.youtube.ecommerce.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostConstruct
    public void initRolesAndUsers(){
        userService.initRolesAndUser();
    }

    @PostMapping({"/registerNewUser"})
    public User registerNewUser(@RequestBody User user){
        return userService.registerNewUser(user);
    }

//    @PostMapping({"/registerNewUser"})
//    public User registerNewUser(@RequestBody User user){
//        return userService.registerNewUser(user);
//    }
//added vendor mapping
    @PostMapping({"/registerNewVendor"})
    public User registerNewVendor(@RequestBody User vendor){
        return userService.registerNewVendor(vendor);
    }

    @GetMapping({"/forAdmin"})
    @PreAuthorize("hasRole('Admin')")
    public String forAdmin(){
        return "This URL is only accessible to Admin";
    }

    @GetMapping({"/forVendor"})
    @PreAuthorize("hasRole('Vendor')")
    public String forVendor(){
        return "This URL is only accessible to Vendor";
    }

    @GetMapping({"/forUser"})
    @PreAuthorize("hasRole('User')")           //If someone has multiple Roles, we need to use this -> ("hasAnyRole('User', 'Customer', 'Admin')")
    public String forUser(){
        return "This URL is only accessible to User";
    }
}