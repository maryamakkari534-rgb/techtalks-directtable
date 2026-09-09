package com.directtable.dto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class CreateOrderItemRequest{

    @NotNull
    private Long menuItemId;
    @Min(1)
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