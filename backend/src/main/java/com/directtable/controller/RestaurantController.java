package com.directtable.controller;

import com.directtable.entity.Restaurant;
import com.directtable.service.RestaurantService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity; // تمت إضافة هذا الاستدعاء

import java.util.List;
import com.directtable.entity.MenuItem;
import org.springframework.web.bind.annotation.PathVariable;
import com.directtable.dto.CreateMenuItemRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.directtable.dto.UpdateMenuItemRequest;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import com.directtable.dto.UpdateAvailabilityRequest;
import org.springframework.web.bind.annotation.PatchMapping;

// Marks this class as a REST controller that handles API requests
@RestController
public class RestaurantController {

    private final RestaurantService restaurantService;

    // Injects RestaurantService dependency(link this class to service)
    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    // Returns all restaurants
    @GetMapping("/restaurants")
    public List<Restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants(); // Gets the restaurant list provided by the service
    }

    // Returns the menu for a specific restaurant by its ID
    @GetMapping("/api/restaurants/{id}/menu")
    public List<MenuItem> getRestaurantMenu(@PathVariable Long id) {
        return restaurantService.getMenuByRestaurantId(id);
    }

    
    @GetMapping("/api/menu/category/{categoryName}")
    public ResponseEntity<List<MenuItem>> getMenuByCategory(@PathVariable String categoryName) {
        List<MenuItem> items = restaurantService.getMenuByCategory(categoryName);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/api/restaurants/{id}/menu")
    public ResponseEntity<MenuItem> addMenuItem(
        @PathVariable Long id,
        @Valid @RequestBody CreateMenuItemRequest request) {

        MenuItem newItem = restaurantService.addMenuItem(id, request);

    return ResponseEntity.status(201).body(newItem);
}

@PutMapping("/api/restaurants/{restaurantId}/menu/{itemId}")
public ResponseEntity<MenuItem> updateMenuItem(
        @PathVariable Long restaurantId,
        @PathVariable Long itemId,
        @Valid @RequestBody UpdateMenuItemRequest request) {

    MenuItem updatedItem = restaurantService.updateMenuItem(
        restaurantId, itemId, request
    );

    return ResponseEntity.ok(updatedItem);
}

@DeleteMapping("/api/restaurants/{restaurantId}/menu/{itemId}")
public ResponseEntity<Void> deleteMenuItem(
        @PathVariable Long restaurantId,
        @PathVariable Long itemId) {

    restaurantService.deleteMenuItem(restaurantId, itemId);

    return ResponseEntity.noContent().build();
}

@PatchMapping(
    "/api/restaurants/{restaurantId}/menu/{itemId}/availability"
)
public ResponseEntity<MenuItem> updateMenuItemAvailability(
        @PathVariable Long restaurantId,
        @PathVariable Long itemId,
        @Valid @RequestBody UpdateAvailabilityRequest request) {

    MenuItem updatedItem =
        restaurantService.updateMenuItemAvailability(
            restaurantId,
            itemId,
            request
        );

    return ResponseEntity.ok(updatedItem);
}




}
