package com.directtable.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

// Represents an item inside an order in the database
@Entity
public class OrderItem {

    // Primary key for the order item table
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    // Each order item belongs to one order
@ManyToOne
private CustomerOrder order;


// Each order item refers to one menu item
@ManyToOne
private MenuItem menuItem;

public CustomerOrder getOrder() {
    return order;
}

public void setOrder(CustomerOrder order) {
    this.order = order;
}

public MenuItem getMenuItem() {
    return menuItem;
}

public void setMenuItem(MenuItem menuItem) {
    this.menuItem = menuItem;
}

}
