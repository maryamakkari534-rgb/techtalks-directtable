
package com.directtable.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CustomerSignupRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^[0-9]{8}$",
        message = "Phone number must contain 8 digits"
    )
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must contain at least 8 characters")
    private String password;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
