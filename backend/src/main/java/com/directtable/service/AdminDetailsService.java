
package com.directtable.service;

import com.directtable.entity.Admin;
import com.directtable.entity.Customer;
import com.directtable.repository.AdminRepository;
import com.directtable.repository.CustomerRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AdminDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;

    public AdminDetailsService(
            AdminRepository adminRepository,
            CustomerRepository customerRepository) {

        this.adminRepository = adminRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        // Customer Login
        if (username.startsWith("customer:")) {

            String phone = username.substring("customer:".length());

            Customer customer = customerRepository.findByPhone(phone)
                    .orElseThrow(() -> new UsernameNotFoundException(
                            "Invalid phone number or password"
                    ));

            if (customer.getPasswordHash() == null ||
                    customer.getPasswordHash().isBlank()) {

                throw new UsernameNotFoundException(
                        "Invalid phone number or password"
                );
            }

            return User.builder()
                    .username("customer:" + customer.getPhone())
                    .password(customer.getPasswordHash())
                    .roles("CUSTOMER")
                    .build();
        }

        // Admin Login
        Admin admin = adminRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Invalid email or password"
                ));

        return User.builder()
                .username(admin.getEmail())
                .password(admin.getPassword())
                .roles("ADMIN")
                .build();
    }
}
