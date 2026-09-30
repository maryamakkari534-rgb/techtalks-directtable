package com.directtable.dto;

import java.util.List;

public class OrderDetailsResponse {

    private Long id;
    private String customerName;
    private String customerPhone;
    private String status;
    private String orderType;
    private String address;
    private String notes;
    private Double totalAmount;
    private String createdAt;
    private List<ReorderItemResponse> items;


    public OrderDetailsResponse(
            Long id,
            String customerName,
            String customerPhone,
            String status,
            String orderType,
            String address,
            String notes,
            Double totalAmount,
            String createdAt,
            List<ReorderItemResponse> items) {

        this.id = id;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.status = status;
        this.orderType = orderType;
        this.address = address;
        this.notes = notes;
        this.totalAmount = totalAmount;
        this.createdAt = createdAt;
        this.items = items;
    }


    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public String getStatus() {
        return status;
    }

    public String getOrderType() {
        return orderType;
    }

    public String getAddress() {
        return address;
    }

    public String getNotes() {
        return notes;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public List<ReorderItemResponse> getItems() {
        return items;
    }
}