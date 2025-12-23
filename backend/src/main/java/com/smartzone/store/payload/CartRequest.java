package com.smartzone.store.payload;

import lombok.Data;

@Data
public class CartRequest {
    private Integer maKhachHang;
    private Integer maSanPham;
    private Integer soLuong;
}