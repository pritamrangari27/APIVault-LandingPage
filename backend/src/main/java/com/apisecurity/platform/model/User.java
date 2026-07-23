package com.apisecurity.platform.model;


import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id                                                    // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)    //auto increment
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    @Email(message = "Must be a valid email")
    @NotBlank(message = "Email is required")
    private String email;

    @Column(nullable = false, length = 255)
    @NotBlank(message = "Password is required")
    private String password;   // will store hashed password, never plaintext

    @Column(nullable = false, length = 50)
    @NotBlank(message = "Name is required")
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist    // runs automatically before a new record is saved
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate     // runs automatically before an existing record is updated
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
