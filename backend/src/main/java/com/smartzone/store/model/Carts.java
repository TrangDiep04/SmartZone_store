package com.smartzone.store.model;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "carts") // Tên bảng chính xác trong SQL của bạn
@Data
public class Carts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maGioHang;

    @ManyToOne
    @JoinColumn(name = "maKhachHang", nullable = false)
    private User user; // Liên kết với bảng users

    @Column(name = "ngayTao")
    private LocalDateTime ngayTao;

    @PrePersist
    protected void onCreate() {
        this.ngayTao = LocalDateTime.now();
    }
}