package com.directtable.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.List;

// Represents a customer's order in the database
@Entity
public class CustomerOrder {

    // Primary key for the order table
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;

    private String createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
    // Each order belongs to one customer
@ManyToOne
private Customer customer;


// Each order belongs to one restaurant
@ManyToOne
private Restaurant restaurant;


// An order can contain multiple order items
@OneToMany(mappedBy = "order")
private List<OrderItem> orderItems;
}