package com.apisecurity.platform.repository;

import com.apisecurity.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    //SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    //SELECT COUNT(*) > 0 FROM users WHERE email = ?
    boolean existsByEmail(String email);
}
