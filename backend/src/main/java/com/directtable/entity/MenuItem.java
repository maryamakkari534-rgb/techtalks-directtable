package com.directtable.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.List;

// Represents a menu item in the database
@Entity
public class MenuItem {

    // Primary key for the menu item table
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private Double price;

    private Boolean available;
    private String category;
    private Boolean isDeleted = false;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
 
   }
   public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
  // Each menu item belongs to one restaurant
@ManyToOne
private Restaurant restaurant;


// A menu item can be included in multiple order items
@OneToMany(mappedBy = "menuItem")
private List<OrderItem> orderItems;

public Restaurant getRestaurant() {
    return restaurant;
}

public void setRestaurant(Restaurant restaurant) {
    this.restaurant = restaurant;
}
public Boolean getIsDeleted() {
    return isDeleted;
}

public void setIsDeleted(Boolean isDeleted) {
    this.isDeleted = isDeleted;
}
}