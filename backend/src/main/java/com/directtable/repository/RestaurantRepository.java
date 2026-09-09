package com.directtable.repository;

import com.directtable.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

// Provides database operations for Restaurant entity
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

}