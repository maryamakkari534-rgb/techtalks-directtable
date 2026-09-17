package com.directtable.dto;
import java.util.List;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;

public class CreateOrderRequest{

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;
    @NotBlank(message = "Customer name is required")
    private String customerName;
    @NotBlank(message = "Customer phone is required")
    @Pattern(
        regexp = "^[0-9]{8}$",
        message = "Phone number must contain 8 digits"
    )
    private String customerPhone;
    @NotBlank(message = "Order type is required")
    private String orderType;
    private String address;
    private String notes;

    @NotEmpty(message = "Order items cannot be empty")
    @Valid
    private List<CreateOrderItemRequest> items;

    public Long getRestaurantId(){
        return restaurantId;
    }
    public void setRestaurantId(Long restaurantId){
        this.restaurantId=restaurantId;
    }

    public String getCustomerName(){
        return customerName;
    }
    public void setCustomerName(String customerName){
        this.customerName=customerName;
    }

    public String getCustomerPhone(){
        return customerPhone;
    }
    public void setCustomerPhone(String customerPhone){
        this.customerPhone=customerPhone;
    }

    public String getOrderType(){
        return orderType;
    }
    public void setOrderType(String orderType){
        this.orderType=orderType;
    }

    public String getAddress(){
        return address;
    }
    public void setAddress(String address){
        this.address=address;
    }

    public String getNotes(){
        return notes;
    }
    public void setNotes(String notes){
        this.notes=notes;
    }

    public List<CreateOrderItemRequest> getItems() {
    return items;
    }
    public void setItems(List<CreateOrderItemRequest> items) {
    this.items = items;
    }
}