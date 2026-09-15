package com.directtable.dto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreateOrderItemRequest{

    @NotNull(message = "Menu item ID is required")
    private Long menuItemId;
    @Positive(message = "Quantity must be greater than zero")
    private int quantity;

    public Long getMenuItemId(){
        return menuItemId;
    }
    public void setMenuItemId(Long menuItemId){
        this.menuItemId=menuItemId;
    }

    public int getQuantity(){
        return quantity;
    }
    public void setQuantity(int quantity){
        this.quantity=quantity;
    }

}