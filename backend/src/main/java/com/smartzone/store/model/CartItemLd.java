package com.smartzone.store.model;

import java.io.Serializable;
import java.util.Objects;

public class CartItemLd implements Serializable {
    private Integer maGioHang;
    private Integer maSanPham;

    public CartItemLd() {}

    public CartItemLd(Integer maGioHang, Integer maSanPham) {
        this.maGioHang = maGioHang;
        this.maSanPham = maSanPham;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CartItemLd)) return false;
        CartItemLd that = (CartItemLd) o;
        return Objects.equals(maGioHang, that.maGioHang) && Objects.equals(maSanPham, that.maSanPham);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maGioHang, maSanPham);
    }
}