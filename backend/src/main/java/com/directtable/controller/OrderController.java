package com.directtable.controller;
import com.directtable.dto.CreateOrderRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.directtable.entity.CustomerOrder;
import com.directtable.service.OrderService;
import org.springframework.web.bind.annotation.GetMapping;
import com.directtable.dto.OrderResponse;
import java.util.List;
import com.directtable.dto.UpdateOrderStatusRequest;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    // Service used by the controller to handle the order creation logic
    private final OrderService orderService;

    // Constructor: Spring injects OrderService into the controller
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
  public ResponseEntity<String> createOrder(
        @Valid @RequestBody CreateOrderRequest request) {
            // Send the request to OrderService to create and save the order
    CustomerOrder order = orderService.createOrder(request);

    // Return a success message with the generated order ID
    return ResponseEntity.ok(
            "Order created successfully. Order ID: " + order.getId()
    );
}
@GetMapping
public ResponseEntity<List<OrderResponse>> getAllOrders() {
    List<OrderResponse> orders = orderService.getAllOrders();
    return ResponseEntity.ok(orders);
}
@PutMapping("/{id}/status")
public ResponseEntity<OrderResponse> updateOrderStatus(
        @PathVariable Long id,
        @RequestBody UpdateOrderStatusRequest request
) {

    CustomerOrder order = orderService.updateOrderStatus(
            id,
            request.getStatus()
    );

    OrderResponse response = new OrderResponse(
            order.getId(),
            order.getCustomer().getName(),
            order.getCustomer().getPhone(),
            order.getStatus(),
            order.getOrderType(),
            order.getAddress(),
            order.getNotes(),
            order.getTotalAmount(),
            order.getCreatedAt()
    );

    return ResponseEntity.ok(response);
}
}