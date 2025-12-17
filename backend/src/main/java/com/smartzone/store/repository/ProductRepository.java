package com.smartzone.store.repository;

import com.smartzone.store.model.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Products, Integer> {
    List<Products> findByNameContainingIgnoreCase(String keyword);
    List<Products> findByBrandContainingIgnoreCase(String brand);
    List<Products> findByCategoryId(Integer categoryId);
}