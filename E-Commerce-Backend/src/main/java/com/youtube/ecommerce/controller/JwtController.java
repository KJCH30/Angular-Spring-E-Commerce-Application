package com.youtube.ecommerce.controller;

import com.youtube.ecommerce.entity.JwtRequest;
import com.youtube.ecommerce.entity.JwtResponse;
import com.youtube.ecommerce.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping({"/authenticate"})
public class JwtController {

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public JwtResponse createJwtToken(@RequestBody JwtRequest jwtRequest)throws Exception{
        return jwtService.createJwtToken(jwtRequest);
    }
}
