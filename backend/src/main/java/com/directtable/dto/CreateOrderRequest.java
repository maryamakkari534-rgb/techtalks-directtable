package com.directtable.dto;
import java.util.List;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.Valid;

public class CreateOrderRequest{

    @NotNull
    private Long restaurantId;
    @NotBlank
    private String customerName;
    @NotBlank
    private String customerPhone;
    @NotBlank
    private String orderType;
    private String address;
    private String notes;

    @NotEmpty
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