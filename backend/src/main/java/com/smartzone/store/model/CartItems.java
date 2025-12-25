package com.smartzone.store.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
@IdClass(CartItemLd.class)
public class CartItems {
    @Id
    private Integer maGioHang;

    @Id
    private Integer maSanPham;

    private LocalDateTime ngayThem;
    private Integer soLuong;

    @ManyToOne
    @JoinColumn(name = "maGioHang", insertable = false, updatable = false)
    private Carts cart;

    // Thêm quan hệ tới Products
    @ManyToOne
    @JoinColumn(name = "maSanPham", insertable = false, updatable = false)
    private Products product;

    // Getters & Setters
    public Integer getMaGioHang() { return maGioHang; }
    public void setMaGioHang(Integer maGioHang) { this.maGioHang = maGioHang; }

    public Integer getMaSanPham() { return maSanPham; }
    public void setMaSanPham(Integer maSanPham) { this.maSanPham = maSanPham; }

    public LocalDateTime getNgayThem() { return ngayThem; }
    public void setNgayThem(LocalDateTime ngayThem) { this.ngayThem = ngayThem; }

    public Integer getSoLuong() { return soLuong; }
    public void setSoLuong(Integer soLuong) { this.soLuong = soLuong; }

//    public Carts getCart() { return cart; }
//    public void setCart(Carts cart) { this.cart = cart; }

    public Products getProduct() { return product; }
    public void setProduct(Products product) { this.product = product; }
}