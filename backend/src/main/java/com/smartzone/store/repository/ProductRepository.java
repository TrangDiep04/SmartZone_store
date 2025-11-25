package com.smartzone.store.repository;
import com.smartzone.store.model.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;



public interface ProductRepository  extends JpaRepository<Products, Integer>{
    List<Products> findByTenSanPhamContainingIgnoreCase(String keyword);

    List<Products> findByThuongHieuIgnoreCase(String thuongHieu);



}
