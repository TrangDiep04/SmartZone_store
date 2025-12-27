package com.smartzone.store.repository;

import com.smartzone.store.model.CartItems;
import com.smartzone.store.model.CartItemId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItems, CartItemId> {
    List<CartItems> findByMaGioHang(Integer maGioHang);
    void deleteByMaGioHangAndMaSanPham(Integer maGioHang, Integer maSanPham);
    void deleteByMaGioHangAndMaSanPhamIn(Integer maGioHang, List<Integer> maSanPhams);
}