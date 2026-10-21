
package com.directtable.service;

import com.directtable.dto.CustomerSignupRequest;
import com.directtable.entity.Customer;
import com.directtable.repository.CustomerRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CustomerAuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerAuthService(
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void signup(CustomerSignupRequest request) {

        if (customerRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Phone number already exists"
            );
        }

        Customer customer = new Customer();

        customer.setName(request.getName());
        customer.setPhone(request.getPhone());

        customer.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        customerRepository.save(customer);
    }
}
