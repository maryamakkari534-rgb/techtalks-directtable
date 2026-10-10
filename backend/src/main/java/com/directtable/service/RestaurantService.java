package com.directtable.service;

import com.directtable.entity.MenuItem;
import com.directtable.repository.RestaurantRepository;
import com.directtable.repository.MenuRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import com.directtable.dto.CreateMenuItemRequest;
import com.directtable.entity.Restaurant;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.directtable.dto.UpdateMenuItemRequest;
import com.directtable.dto.UpdateAvailabilityRequest;

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
    return menuRepository.findByRestaurantIdAndIsDeletedFalse(id);
}
   public List<MenuItem> getMenuByCategory(String categoryName) {
    return menuRepository.findByCategoryAndIsDeletedFalse(categoryName);
   }

public MenuItem addMenuItem(Long restaurantId, CreateMenuItemRequest request) {

    Restaurant restaurant = restaurantRepository.findById(restaurantId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Restaurant not found"
        ));

    MenuItem item = new MenuItem();

    item.setName(request.getName());
    item.setDescription(request.getDescription());
    item.setPrice(request.getPrice());
    item.setCategory(request.getCategory());
    item.setAvailable(request.getAvailable());

    item.setIsDeleted(false);
    item.setRestaurant(restaurant);

    return menuRepository.save(item);
}

public MenuItem updateMenuItem(Long restaurantId, Long itemId, UpdateMenuItemRequest request) {

    MenuItem item = menuRepository.findById(itemId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Menu item not found"
        ));

    if (!item.getRestaurant().getId().equals(restaurantId)
            || Boolean.TRUE.equals(item.getIsDeleted())) {
        throw new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Menu item not found"
        );
    }

    item.setName(request.getName());
    item.setDescription(request.getDescription());
    item.setPrice(request.getPrice());
    item.setCategory(request.getCategory());
    item.setAvailable(request.getAvailable());

    return menuRepository.save(item);
}

public void deleteMenuItem(Long restaurantId, Long itemId) {

    MenuItem item = menuRepository.findById(itemId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Menu item not found"
        ));

    if (!item.getRestaurant().getId().equals(restaurantId)
            || Boolean.TRUE.equals(item.getIsDeleted())) {
        throw new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Menu item not found"
        );
    }

    item.setIsDeleted(true);

    menuRepository.save(item);
}

public MenuItem updateMenuItemAvailability(
        Long restaurantId,
        Long itemId,
        UpdateAvailabilityRequest request) {

    MenuItem item = menuRepository.findById(itemId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Menu item not found"
        ));

    if (!item.getRestaurant().getId().equals(restaurantId)
            || Boolean.TRUE.equals(item.getIsDeleted())) {

        throw new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Menu item not found"
        );
    }

    item.setAvailable(request.getAvailable());

    return menuRepository.save(item);
}



}