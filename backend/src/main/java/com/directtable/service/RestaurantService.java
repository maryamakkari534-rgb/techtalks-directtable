package com.directtable.service;

import com.directtable.entity.MenuItem;
import com.directtable.repository.RestaurantRepository;
import com.directtable.repository.MenuRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuRepository menuRepository;

    public RestaurantService(RestaurantRepository restaurantRepository, MenuRepository menuRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuRepository = menuRepository;
    }

    public List<com.directtable.entity.Restaurant> getAllRestaurants() { 
        return restaurantRepository.findAll(); 
    }

    public List<MenuItem> getMenuByRestaurantId(Long id) {
        return menuRepository.findByRestaurantId(id); 
    }
}