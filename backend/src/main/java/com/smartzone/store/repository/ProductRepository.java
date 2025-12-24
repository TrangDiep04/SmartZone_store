package com.smartzone.store.repository;

import com.smartzone.store.model.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
//them dong nay
import org.springframework.data.jpa.repository.Query;
@Repository
public interface ProductRepository extends JpaRepository<Products, Integer> {
    List<Products> findByNameContainingIgnoreCase(String keyword);
    List<Products> findByBrandContainingIgnoreCase(String brand);
    List<Products> findByCategoryId(Integer categoryId);


    // them vao loc
    @Query("SELECT p FROM Products p WHERE " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "(:brand IS NULL OR p.brand = :brand) ")
    List<Products> filterProducts(Double minPrice, Double maxPrice, String brand);
}