package com.smartzone.store.repository;

import com.smartzone.store.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Phương thức cần thiết cho Đăng nhập
    Optional<User> findByTenDangNhap(String tenDangNhap);
    
    // ⭐ PHƯƠNG THỨC tìm email 
    Optional<User> findByEmail(String email);
}
