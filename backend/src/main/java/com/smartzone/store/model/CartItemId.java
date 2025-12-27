package com.smartzone.store.model;

import java.io.Serializable;
import java.util.Objects;

public class CartItemId implements Serializable {
    private Integer maGioHang;
    private Integer maSanPham;

    public CartItemId() {}

    public CartItemId(Integer maGioHang, Integer maSanPham) {
        this.maGioHang = maGioHang;
        this.maSanPham = maSanPham;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CartItemId)) return false;
        CartItemId that = (CartItemId) o;
        return Objects.equals(maGioHang, that.maGioHang) && Objects.equals(maSanPham, that.maSanPham);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maGioHang, maSanPham);
    }
}