package com.smartzone.store.repository;

import com.smartzone.store.model.CartItems;
import com.smartzone.store.model.CartItemsId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartItemsRepository extends JpaRepository<CartItems, CartItemsId> {
    // Spring Data JPA sẽ tự hiểu câu lệnh này
    List<CartItems> findByCarts_MaGioHang(Integer maGioHang);
}