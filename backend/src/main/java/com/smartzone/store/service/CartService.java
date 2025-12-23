package com.smartzone.store.service;

import com.smartzone.store.model.*;
import com.smartzone.store.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class CartService {

    @Autowired private CartsRepository cartsRepository;
    @Autowired private CartItemsRepository cartItemsRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productsRepository; // Nhớ kiểm tra tên Repository này của bạn

    @Transactional
    public void addProductToCart(Integer maKhachHang, Integer maSanPham, Integer soLuong) {
        // 1. Tìm giỏ hàng mới nhất của khách, nếu không có thì tạo mới
        Carts cart = cartsRepository.findTopByUser_MaKhachHangOrderByNgayTaoDesc(maKhachHang)
            .orElseGet(() -> {
                Carts newCart = new Carts();
                User user = userRepository.findById(maKhachHang)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));
                newCart.setUser(user);
                return cartsRepository.save(newCart);
            });

        // 2. Kiểm tra xem sản phẩm này đã nằm trong giỏ hàng đó chưa
        CartItemsId itemId = new CartItemsId(cart.getMaGioHang(), maSanPham);
        
        cartItemsRepository.findById(itemId).ifPresentOrElse(
            item -> {
                // Nếu đã có: Tăng số lượng và cập nhật ngày thêm
                item.setSoLuong(item.getSoLuong() + soLuong);
                item.setNgayThem(LocalDateTime.now());
                cartItemsRepository.save(item);
            },
            () -> {
                // Nếu chưa có: Tạo mới một dòng trong cart_items
                CartItems newItem = new CartItems();
                newItem.setId(itemId);
                newItem.setCarts(cart);
                
                Products product = productsRepository.findById(maSanPham)
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!"));
                newItem.setProducts(product);
                
                newItem.setSoLuong(soLuong);
                // Trường ngayThem sẽ được @PrePersist trong Model tự động gán
                cartItemsRepository.save(newItem);
            }
        );
    }
}