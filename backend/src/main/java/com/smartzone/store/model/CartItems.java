package com.smartzone.store.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
@Data
public class CartItems {

    @EmbeddedId
    private CartItemsId id;

    @ManyToOne
    @MapsId("maGioHang")
    @JoinColumn(name = "maGioHang")
    private Carts carts;

    @ManyToOne
    @MapsId("maSanPham")
    @JoinColumn(name = "maSanPham")
    private Products products; // Phải là Products (có s) để khớp với file bạn gửi

    @Column(name = "soLuong")
    private Integer soLuong;

    @Column(name = "ngayThem")
    private LocalDateTime ngayThem;

    @PrePersist
    protected void onCreate() {
        this.ngayThem = LocalDateTime.now();
    }
}