package com.smartzone.store.repository;

import com.smartzone.store.model.Carts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartsRepository extends JpaRepository<Carts, Integer> {
    // Tìm giỏ hàng mới nhất của người dùng dựa trên mã khách hàng
    Optional<Carts> findTopByUser_MaKhachHangOrderByNgayTaoDesc(Integer maKhachHang);
}