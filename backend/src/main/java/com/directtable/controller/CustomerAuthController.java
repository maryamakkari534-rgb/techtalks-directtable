
package com.directtable.controller;

import com.directtable.dto.CustomerSignupRequest;
import com.directtable.service.CustomerAuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customer/auth")
public class CustomerAuthController {

    private final CustomerAuthService customerAuthService;

    public CustomerAuthController(
            CustomerAuthService customerAuthService) {
        this.customerAuthService = customerAuthService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(
            @Valid @RequestBody CustomerSignupRequest request) {

        customerAuthService.signup(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Customer account created successfully"
                ));
    }
}
