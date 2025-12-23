package com.smartzone.store.service;

import com.smartzone.store.model.*;
import com.smartzone.store.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired private CartsRepository cartsRepository;
    @Autowired private CartItemsRepository cartItemsRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productsRepository;

    @Transactional
    public void addProductToCart(Integer maKhachHang, Integer maSanPham, Integer soLuong) {
        Carts cart = cartsRepository.findTopByUser_MaKhachHangOrderByNgayTaoDesc(maKhachHang)
            .orElseGet(() -> {
                Carts newCart = new Carts();
                User user = userRepository.findById(maKhachHang)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng!"));
                newCart.setUser(user);
                return cartsRepository.save(newCart);
            });

        CartItemsId itemId = new CartItemsId(cart.getMaGioHang(), maSanPham);
        
        cartItemsRepository.findById(itemId).ifPresentOrElse(
            item -> {
                int newQty = item.getSoLuong() + soLuong;
                if (newQty <= 0) {
                    cartItemsRepository.delete(item);
                } else {
                    item.setSoLuong(newQty);
                    item.setNgayThem(LocalDateTime.now());
                    cartItemsRepository.save(item);
                }
            },
            () -> {
                if (soLuong > 0) {
                    CartItems newItem = new CartItems();
                    newItem.setId(itemId);
                    newItem.setCarts(cart);
                    Products product = productsRepository.findById(maSanPham)
                        .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!"));
                    newItem.setProducts(product);
                    newItem.setSoLuong(soLuong);
                    cartItemsRepository.save(newItem);
                }
            }
        );
    }

    public List<Map<String, Object>> getCartItems(Integer maKhachHang) {
        Carts cart = cartsRepository.findTopByUser_MaKhachHangOrderByNgayTaoDesc(maKhachHang).orElse(null);
        if (cart == null) return new ArrayList<>();

        return cartItemsRepository.findByCarts_MaGioHang(cart.getMaGioHang())
                .stream()
                .map(item -> {
                    Map<String, Object> map = new HashMap<>();
                    Products p = item.getProducts();
                    
                    // Khớp đúng với Getter trong file Products.java của bạn
                    map.put("maSanPham", p.getId());
                    map.put("tenSanPham", p.getName());
                    map.put("hinhAnh", p.getImage());
                    map.put("gia", p.getPrice());
                    
                    map.put("soLuong", item.getSoLuong());
                    map.put("ngayThem", item.getNgayThem());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeItemFromCart(Integer maKhachHang, Integer maSanPham) {
        Carts cart = cartsRepository.findTopByUser_MaKhachHangOrderByNgayTaoDesc(maKhachHang)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));
        
        CartItemsId itemId = new CartItemsId(cart.getMaGioHang(), maSanPham);
        cartItemsRepository.deleteById(itemId);
    }
}