package com.smartzone.store.service;

import com.smartzone.store.model.Carts;
import com.smartzone.store.model.CartItems;
import com.smartzone.store.model.CartItemId;
import com.smartzone.store.repository.CartRepository;
import com.smartzone.store.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private CartItemRepository itemRepo;

    public List<CartItems> getCart(Integer maKhachHang) {
        Carts cart = cartRepo.findByMaKhachHang(maKhachHang)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));
        return itemRepo.findByMaGioHang(cart.getMaGioHang());
    }

    public CartItems addToCart(Integer maKhachHang, Integer maSanPham, Integer delta) {
        Carts cart = cartRepo.findByMaKhachHang(maKhachHang)
                .orElseGet(() -> {
                    Carts newCart = new Carts();
                    newCart.setMaKhachHang(maKhachHang);
                    newCart.setNgayTao(LocalDateTime.now());
                    return cartRepo.save(newCart);
                });

        CartItemId id = new CartItemId(cart.getMaGioHang(), maSanPham);

        CartItems item = itemRepo.findById(id).orElseGet(() -> {
            CartItems newItem = new CartItems();
            newItem.setMaGioHang(cart.getMaGioHang());
            newItem.setMaSanPham(maSanPham);
            newItem.setNgayThem(LocalDateTime.now());
            newItem.setSoLuong(0);
            return newItem;
        });

        int newQuantity = item.getSoLuong() + delta;
        if (newQuantity <= 0) {
            itemRepo.delete(item);
            return null;
        } else {
            item.setSoLuong(newQuantity);
            return itemRepo.save(item);
        }
    }
    @Transactional
    public void removeFromCart(Integer maKhachHang, Integer maSanPham) {
        Carts cart = cartRepo.findByMaKhachHang(maKhachHang)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));
        itemRepo.deleteByMaGioHangAndMaSanPham(cart.getMaGioHang(), maSanPham);
    }
    @Transactional
    public void removeSelected(Integer maKhachHang, List<Integer> ids) {
        Carts cart = cartRepo.findByMaKhachHang(maKhachHang)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));
        itemRepo.deleteByMaGioHangAndMaSanPhamIn(cart.getMaGioHang(), ids);
    }
}