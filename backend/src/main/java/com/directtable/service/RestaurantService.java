package com.directtable.service;

import org.springframework.stereotype.Service;

import com.directtable.entity.Restaurant;

import com.directtable.repository.RestaurantRepository;

import java.util.List;

// Marks this class as a service managed by Spring that contains business logic
@Service 
public class RestaurantService {

     private final RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }
    public List<Restaurant> getAllRestaurants() { // Returns a list of all restaurants
    return restaurantRepository.findAll(); // Fetches all restaurants from the database

}

}