package com.youtube.ecommerce.service;

import com.youtube.ecommerce.dao.RoleDao;
import com.youtube.ecommerce.dao.UserDao;
import com.youtube.ecommerce.entity.Role;
import com.youtube.ecommerce.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.logging.Logger;

@Service
public class UserService {
    private static final Logger logger = Logger.getLogger(UserService.class.getName());
    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleDao roleDao;

    public User registerNewUser(User user){
        Role role = roleDao.findById("User").get();

        Set<Role> roleSet = new HashSet<>();
        roleSet.add(role);
        user.setRole(roleSet);

        String password = getEncodedPassword(user.getUserPassword());
        user.setUserPassword(password);

        return userDao.save(user);
    }

//    public User registerNewUser(User user){
//        Role role = roleDao.findById("User").get();
//        Set<Role> roles = new HashSet<>();
//        roles.add(role);
//        user.setRole(roles);
//
//        user.setUserPassword(getEncodedPassword(user.getUserPassword()));
//        return userDao.save(user);
//    }

    public User registerNewVendor(User vendor){
        Role role = roleDao.findById("Vendor").get();
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        vendor.setRole(roles);
        vendor.setUserPassword(getEncodedPassword(vendor.getUserPassword()));
        return userDao.save(vendor);
    }

    public void initRolesAndUser(){
        //Added Vendor Role
        Role vendorRole = new Role();
        vendorRole.setRoleName("Vendor");
        vendorRole.setRoleDescription("Vendor role for an application");
        roleDao.save(vendorRole);
        logger.info("Vendor role added: " + vendorRole);

        Role adminRole = new Role();
        adminRole.setRoleName("Admin");
        adminRole.setRoleDescription("Admin role for an application");
        roleDao.save(adminRole);

        Role userRole = new Role();
        userRole.setRoleName("User");
        userRole.setRoleDescription("Default role for newly created user");
        roleDao.save(userRole);

        User adminUser = new User();
        adminUser.setUserName("admin30");
        adminUser.setUserFirstName("admin");
        adminUser.setUserLastName("admin");
        adminUser.setUserPassword(getEncodedPassword("admin@pass"));

        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(adminRole);
        adminUser.setRole(adminRoles);
        userDao.save(adminUser);

//        User user = new User();
//        user.setUserName("kinjal30");
//        user.setUserFirstName("kinjal");
//        user.setUserLastName("chowdhury");
//        user.setUserPassword(getEncodedPassword("kinjal@pass"));
//
//        Set<Role> userRoles = new HashSet<>();
//        userRoles.add(userRole);
//        user.setRole(userRoles);
//        userDao.save(user);
    }

    public String getEncodedPassword(String password){
        return passwordEncoder.encode(password);
    }
}

