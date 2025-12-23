package com.smartzone.store.repository;

import com.smartzone.store.model.CartItems;
import com.smartzone.store.model.CartItemsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemsRepository extends JpaRepository<CartItems, CartItemsId> {
}