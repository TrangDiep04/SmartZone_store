package com.smartzone.store.repository;

import com.smartzone.store.model.Carts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Carts, Integer> {
    Optional<Carts> findByMaKhachHang(Integer maKhachHang);
}
