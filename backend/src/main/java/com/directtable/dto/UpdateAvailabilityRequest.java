
package com.directtable.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateAvailabilityRequest {

    @NotNull
    private Boolean available;

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}
