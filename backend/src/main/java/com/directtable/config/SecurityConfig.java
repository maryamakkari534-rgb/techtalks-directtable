
package com.directtable.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
        .csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
)

.authorizeHttpRequests(auth -> auth

    // Authentication
    .requestMatchers(
        "/api/auth/login",
        "/api/auth/csrf"
    ).permitAll()

    .requestMatchers("/api/auth/me")
    .authenticated()
    .requestMatchers(
    HttpMethod.POST,
    "/api/customer/auth/signup"
).permitAll()

    // Public Restaurant APIs
    .requestMatchers(
        HttpMethod.GET,
        "/restaurants",
        "/api/restaurants/*/menu",
        "/api/menu/category/*"
    ).permitAll()

    .requestMatchers(HttpMethod.POST, "/api/orders").hasRole("CUSTOMER")

    // Admin Menu Management
    .requestMatchers(
        HttpMethod.POST,
        "/api/restaurants/*/menu"
    ).hasRole("ADMIN")

    .requestMatchers(
        HttpMethod.PUT,
        "/api/restaurants/*/menu/*"
    ).hasRole("ADMIN")

    .requestMatchers(
        HttpMethod.DELETE,
        "/api/restaurants/*/menu/*"
    ).hasRole("ADMIN")

    .requestMatchers(
        HttpMethod.PATCH,
        "/api/restaurants/*/menu/*/availability"
    ).hasRole("ADMIN")

    .requestMatchers(
    HttpMethod.GET,
    "/api/orders/history/*"
).hasAnyRole("ADMIN", "CUSTOMER")

.requestMatchers(
    HttpMethod.GET,
    "/api/orders/*/reorder"
).hasRole("CUSTOMER")

.requestMatchers(
    HttpMethod.GET,
    "/api/orders/*/details"
).hasAnyRole("ADMIN", "CUSTOMER")
    // Admin Order Management
    .requestMatchers("/api/orders/**")
    .hasRole("ADMIN")

    // Block other unconfigured endpoints
    .anyRequest().denyAll()
)
.exceptionHandling(ex -> ex
    .authenticationEntryPoint(
        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
    )
)
            .formLogin(form -> form
                .loginProcessingUrl("/api/auth/login")
                .usernameParameter("email")
                .successHandler((request, response, authentication) -> {
                    response.setStatus(HttpStatus.OK.value());
                })
                .failureHandler((request, response, exception) -> {
                    response.sendError(
                        HttpStatus.UNAUTHORIZED.value(),
                        "Invalid email or password"
                    );
                })
            )
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(HttpStatus.OK.value());
                })
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            );

        return http.build();
    }
}
