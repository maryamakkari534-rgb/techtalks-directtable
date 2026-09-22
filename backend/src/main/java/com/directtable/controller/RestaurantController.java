package com.directtable.controller;

import com.directtable.entity.Restaurant;
import com.directtable.service.RestaurantService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.directtable.entity.MenuItem;
import org.springframework.web.bind.annotation.PathVariable;

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

}