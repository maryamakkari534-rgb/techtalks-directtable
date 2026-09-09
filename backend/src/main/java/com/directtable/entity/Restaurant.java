package com.directtable.entity; //this class is in a package called entity

import jakarta.persistence.Entity; //brings annotation called entity from JPA

import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.OneToMany;
import java.util.List;

@Entity //makes the class as a table in database

public class Restaurant {
   
    @Id // Marks this field as the primary key of the database table
@GeneratedValue(strategy = GenerationType.IDENTITY) // Automatically generates unique ID values for new records identity gives ordered numbers 1 2 3 etc...

private Long id;
private String name;
private String address;
private String phone;
private String description;

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

public String getAddress() {
    return address;
}

public void setAddress(String address) {
    this.address = address;
}

public String getPhone() {
    return phone;
}

public void setPhone(String phone) {
    this.phone = phone;
}

public String getDescription() {
    return description;
}

public void setDescription(String description) {
    this.description = description;
}

// A restaurant can have multiple menu items
@OneToMany(mappedBy = "restaurant")
private List<MenuItem> menuItems;


// A restaurant can have multiple orders
@OneToMany(mappedBy = "restaurant")
private List<CustomerOrder> orders;

}
