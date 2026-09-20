package com.directtable.dto;

import java.util.List;

public class ReorderResponse {

    private Long originalOrderId;
    private Long restaurantId;
    private List<ReorderItemResponse> items;

    public ReorderResponse(
            Long originalOrderId,
            Long restaurantId,
            List<ReorderItemResponse> items) {

        this.originalOrderId = originalOrderId;
        this.restaurantId = restaurantId;
        this.items = items;
    }

    public Long getOriginalOrderId() {
        return originalOrderId;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public List<ReorderItemResponse> getItems() {
        return items;
    }
}
