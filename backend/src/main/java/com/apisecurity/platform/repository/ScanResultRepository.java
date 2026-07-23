package com.apisecurity.platform.repository;

import com.apisecurity.platform.model.ScanResult;
import com.apisecurity.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanResultRepository extends JpaRepository<ScanResult, Long> {

    // get all scans for a specific user, newest first
    List<ScanResult> findByUserOrderByCreatedAtDesc(User user);

    // count how many scans a user has done
    long countByUser(User user);
}
