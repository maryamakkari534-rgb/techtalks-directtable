package com.directtable.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.List;
import jakarta.persistence.Column;
import com.fasterxml.jackson.annotation.JsonIgnore;
// Represents a customer in the database
@Entity
public class Customer {

    // Primary key for the customer table
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String phone;

    private String email;

    @JsonIgnore
@Column(name = "password_hash")
private String passwordHash;

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


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    // A customer can have multiple orders
@OneToMany(mappedBy = "customer")
private List<CustomerOrder> orders;
@JsonIgnore
public String getPasswordHash() {
    return passwordHash;
}

public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
}

}