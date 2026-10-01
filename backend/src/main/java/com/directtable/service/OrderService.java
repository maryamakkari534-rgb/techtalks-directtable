package com.directtable.service;
import com.directtable.repository.RestaurantRepository;
import com.directtable.repository.CustomerOrderRepository;
import com.directtable.repository.MenuItemRepository;
import com.directtable.repository.CustomerRepository;
import com.directtable.repository.OrderItemRepository;
import com.directtable.dto.CreateOrderRequest;
import com.directtable.entity.CustomerOrder;
import com.directtable.entity.Restaurant;
import com.directtable.exception.ResourceNotFoundException;
import com.directtable.entity.Customer;
import com.directtable.dto.CreateOrderItemRequest;
import com.directtable.entity.MenuItem;
import com.directtable.entity.OrderItem;
import org.springframework.transaction.annotation.Transactional;
import com.directtable.dto.OrderResponse;
import org.springframework.stereotype.Service;//to use @Service
import com.directtable.dto.ReorderResponse;
import com.directtable.dto.ReorderItemResponse;
import com.directtable.dto.OrderDetailsResponse;
import java.util.List;

@Service//to let the spring know it's not an ordinary class, and to be able to manage the object
public class OrderService {

    private final RestaurantRepository restaurantRepository;//tools for the service to speak with database
    private final CustomerOrderRepository customerOrderRepository;
    private final MenuItemRepository menuItemRepository;
    private final CustomerRepository customerRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderService(
        RestaurantRepository restaurantRepository,
        CustomerOrderRepository customerOrderRepository,
        MenuItemRepository menuItemRepository,
        CustomerRepository customerRepository,
        OrderItemRepository orderItemRepository) {//constructor

    this.restaurantRepository = restaurantRepository;
    this.customerOrderRepository = customerOrderRepository;
    this.menuItemRepository = menuItemRepository;
    this.customerRepository = customerRepository;
    this.orderItemRepository = orderItemRepository;
    }
// Makes the whole order creation process one transaction.
// If any error happens while creating the order, all database changes are rolled back.
@Transactional
    // Creates a new order using the data received from the frontend
public CustomerOrder createOrder(CreateOrderRequest request) {
    // Check if request exists
    if (request == null) {
        throw new RuntimeException("Order request cannot be null");
    }

    // Check if order contains items
    if (request.getItems() == null || request.getItems().isEmpty()) {
        throw new RuntimeException("Order must contain at least one item");
    }

    // Find the restaurant using the restaurantId from the request
    Restaurant restaurant = restaurantRepository
            .findById(request.getRestaurantId())
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    
    // Check order type before converting to uppercase
    if (request.getOrderType() == null) {
        throw new RuntimeException("Order type is required");
    }

    // Get the order type and convert it to uppercase
    // Example: delivery -> DELIVERY
    String orderType = request.getOrderType().toUpperCase();


    // The order type must be PICKUP or DELIVERY
    if (!orderType.equals("PICKUP") && !orderType.equals("DELIVERY")) {
        throw new RuntimeException("Invalid order type");
    }


    // If the order is DELIVERY, an address is required
    if (orderType.equals("DELIVERY") &&
            (request.getAddress() == null || request.getAddress().isBlank())) {

        throw new RuntimeException("Address is required for delivery orders");
    }


    // Search for an existing customer using the phone number
    Customer customer = customerRepository
            .findByPhone(request.getCustomerPhone())
            .orElseGet(() -> {

                // If the customer does not exist, create a new customer
                Customer newCustomer = new Customer();

                newCustomer.setName(request.getCustomerName());
                newCustomer.setPhone(request.getCustomerPhone());

                // Save the new customer in the database
                return customerRepository.save(newCustomer);
            });


    // Create a new order object
    CustomerOrder order = new CustomerOrder();

    // Connect the order to the restaurant
    order.setRestaurant(restaurant);

    // Connect the order to the customer
    order.setCustomer(customer);

    // Add order information
    order.setOrderType(orderType);
    order.setAddress(request.getAddress());
    order.setNotes(request.getNotes());

    // Every new order starts with status NEW
    order.setStatus("NEW");

    // Save the current date and time
    order.setCreatedAt(java.time.LocalDateTime.now().toString());


    // Save the order first so the database generates an ID
    order = customerOrderRepository.save(order);


    // Start the total amount from zero
    double totalAmount = 0.0;


    // Go through every item sent in the order
    for (CreateOrderItemRequest itemRequest : request.getItems()) {
        if (itemRequest.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than zero");
        }

        if (itemRequest.getMenuItemId() == null) {
            throw new RuntimeException("Menu item ID is required");
         }

        // Find the MenuItem in the database using its ID
       MenuItem menuItem = menuItemRepository
    .findById(itemRequest.getMenuItemId())
    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
    
        if (!menuItem.getRestaurant().getId().equals(restaurant.getId())) {
            throw new RuntimeException(
            "Menu item does not belong to this restaurant"
             );
        }


        // Check that the menu item is available
        if (!Boolean.TRUE.equals(menuItem.getAvailable())) {
            throw new RuntimeException("Menu item is not available");
        }


        // Calculate this item's total:
        // price × quantity
        double itemTotal =
                menuItem.getPrice() * itemRequest.getQuantity();


        // Add this item's price to the whole order total
        totalAmount = totalAmount + itemTotal;


        // Create a new OrderItem
        OrderItem orderItem = new OrderItem();

        // Set the quantity
        orderItem.setQuantity(itemRequest.getQuantity());

        // Connect the OrderItem to this order
        orderItem.setOrder(order);

        // Connect the OrderItem to the MenuItem
        orderItem.setMenuItem(menuItem);


        // Save the OrderItem in the database
        orderItemRepository.save(orderItem);
    }


    // After calculating all items, set the final total
    order.setTotalAmount(totalAmount);


    // Save the order again to update totalAmount
    order = customerOrderRepository.save(order);


    // Return the completed order
    return order;
}

    public List<OrderResponse> getAllOrders() {
    return customerOrderRepository.findAll()
            .stream()
            .map(order -> new OrderResponse(
                    order.getId(),
                    order.getCustomer().getName(),
                    order.getCustomer().getPhone(),
                    order.getStatus(),
                    order.getOrderType(),
                    order.getAddress(),
                    order.getNotes(),
                    order.getTotalAmount(),
                    order.getCreatedAt()
            ))
            .toList();
}
public CustomerOrder updateOrderStatus(Long id, String status) {

    CustomerOrder order = customerOrderRepository
        .findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

    List<String> allowedStatuses = List.of(
            "NEW",
            "PREPARING",
            "READY",
            "COMPLETED"
    );

    if (!allowedStatuses.contains(status)) {
        throw new RuntimeException("Invalid order status");
    }

    String currentStatus = order.getStatus();

    boolean validTransition =
            (currentStatus.equals("NEW") && status.equals("PREPARING")) ||
            (currentStatus.equals("PREPARING") && status.equals("READY")) ||
            (currentStatus.equals("READY") && status.equals("COMPLETED"));


    if (!validTransition) {
        throw new RuntimeException(
                "Invalid status transition from "
                + currentStatus
                + " to "
                + status
        );
    }


    order.setStatus(status);

    return customerOrderRepository.save(order);
}
public List<OrderResponse> getCustomerOrderHistory(String phone) {

    return customerOrderRepository.findByCustomer_Phone(phone)
            .stream()
            .map(order -> new OrderResponse(
                    order.getId(),
                    order.getCustomer().getName(),
                    order.getCustomer().getPhone(),
                    order.getStatus(),
                    order.getOrderType(),
                    order.getAddress(),
                    order.getNotes(),
                    order.getTotalAmount(),
                    order.getCreatedAt()
            ))
            .toList();
}
public ReorderResponse getReorderData(Long orderId) {

    // Find the old order
    CustomerOrder order = customerOrderRepository
        .findById(orderId)
        .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

    // Get all items that belong to this order
    List<OrderItem> orderItems =
            orderItemRepository.findByOrder_Id(orderId);

    // Convert OrderItems into ReorderItemResponse objects
    List<ReorderItemResponse> items = orderItems
            .stream()
            .map(orderItem -> new ReorderItemResponse(
                    orderItem.getMenuItem().getId(),
                    orderItem.getMenuItem().getName(),
                    orderItem.getMenuItem().getPrice(),
                    orderItem.getQuantity(),
                    orderItem.getMenuItem().getAvailable()
            ))
            .toList();

    // Return old order ID, restaurant ID and items
    return new ReorderResponse(
            order.getId(),
            order.getRestaurant().getId(),
            items
    );
}
public OrderDetailsResponse getOrderDetails(Long orderId) {

    CustomerOrder order = customerOrderRepository
            .findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));


    List<ReorderItemResponse> items = order.getOrderItems()
            .stream()
            .map(orderItem -> new ReorderItemResponse(
                    orderItem.getMenuItem().getId(),
                    orderItem.getMenuItem().getName(),
                    orderItem.getMenuItem().getPrice(),
                    orderItem.getQuantity(),
                    orderItem.getMenuItem().getAvailable()
            ))
            .toList();


    return new OrderDetailsResponse(
            order.getId(),
            order.getCustomer().getName(),
            order.getCustomer().getPhone(),
            order.getStatus(),
            order.getOrderType(),
            order.getAddress(),
            order.getNotes(),
            order.getTotalAmount(),
            order.getCreatedAt(),
            items
    );
}
}
