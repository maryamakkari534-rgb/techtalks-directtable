package com.directtable.dto;

public class ReorderItemResponse {

    private Long menuItemId;
    private String name;
    private Double price;
    private Integer quantity;
    private Boolean available;

    public ReorderItemResponse(
            Long menuItemId,
            String name,
            Double price,
            Integer quantity,
            Boolean available) {

        this.menuItemId = menuItemId;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.available = available;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public String getName() {
        return name;
    }

    public Double getPrice() {
        return price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Boolean getAvailable() {
        return available;
    }
}