package com.smartzone.store.model;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Lớp này gom 2 mã lại thành 1 cái ID duy nhất cho bảng trung gian
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemsId implements Serializable {
    private Integer maGioHang;
    private Integer maSanPham;
}