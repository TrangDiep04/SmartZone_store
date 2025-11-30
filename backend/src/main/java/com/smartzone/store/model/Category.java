package com.smartzone.store.model;

import javax.persistence.*;

@Entity
@Table(name = "CATEGORIES")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "maDanhMuc")
    private Integer maDanhMuc;

    @Column(name = "tenDanhMuc", nullable = false, length = 100)
    private String tenDanhMuc;

    @Column(name = "moTaDanhMuc", columnDefinition = "TEXT")
    private String moTaDanhMuc;

    public Category() {}

    public Category(String tenDanhMuc, String moTaDanhMuc) {
        this.tenDanhMuc = tenDanhMuc;
        this.moTaDanhMuc = moTaDanhMuc;
    }

    public Integer getMaDanhMuc() {
        return maDanhMuc;
    }

    public void setMaDanhMuc(Integer maDanhMuc) {
        this.maDanhMuc = maDanhMuc;
    }

    public String getTenDanhMuc() {
        return tenDanhMuc;
    }

    public void setTenDanhMuc(String tenDanhMuc) {
        this.tenDanhMuc = tenDanhMuc;
    }

    public String getMoTaDanhMuc() {
        return moTaDanhMuc;
    }

    public void setMoTaDanhMuc(String moTaDanhMuc) {
        this.moTaDanhMuc = moTaDanhMuc;
    }
}
