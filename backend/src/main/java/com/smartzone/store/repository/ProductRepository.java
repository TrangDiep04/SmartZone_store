package com.smartzone.store.repository;

import com.smartzone.store.model.Products;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Products, Integer> {
    List<Products> findByNameContainingIgnoreCase(String keyword);
    List<Products> findByBrandContainingIgnoreCase(String brand);
    List<Products> findByCategoryId(Integer categoryId);
}