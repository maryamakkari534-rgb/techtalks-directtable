package com.directtable.controller;
import com.directtable.dto.CreateOrderRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostMapping
  public ResponseEntity<String> createOrder(
        @Valid @RequestBody CreateOrderRequest request) {

    return ResponseEntity.ok("Order request received");
}

}