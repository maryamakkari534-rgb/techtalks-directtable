
package com.directtable.config;

import com.directtable.entity.Admin;
import com.directtable.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    public CommandLineRunner createAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            @Value("${ADMIN_PASSWORD}") String adminPassword) {

        return args -> {
            String email = "admin@directtable.test";

            if (adminRepository.findByEmail(email).isEmpty()) {
                Admin admin = new Admin();
                admin.setEmail(email);
                admin.setPassword(passwordEncoder.encode(adminPassword));

                adminRepository.save(admin);
                System.out.println("Admin account created successfully");
            }
        };
    }
}
