<<<<<<< HEAD
package com.smartzone.store.repository;

import com.smartzone.store.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Phương thức cần thiết cho Đăng nhập
    Optional<User> findByTenDangNhap(String tenDangNhap);
    
    // ⭐ PHƯƠNG THỨC tìm email 
    Optional<User> findByEmail(String email);
=======
package com.smartzone.store.repository;

import com.smartzone.store.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Phương thức cần thiết cho Đăng nhập
    Optional<User> findByTenDangNhap(String tenDangNhap);
    
    // ⭐ PHƯƠNG THỨC tìm email 
    Optional<User> findByEmail(String email);
>>>>>>> e748f32ad2f984ab7d66a0a4f40f683ba908937d
}